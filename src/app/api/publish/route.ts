import { NextResponse } from 'next/server'
import { createServiceClient } from '@/utils/supabase/service'
import { publishToFacebook } from './facebook'
import { publishToLinkedIn } from './linkedin'
import { publishToInstagram } from './instagram'

/**
 * POST /api/publish
 * 
 * The Publishing Engine — triggered by Vercel Cron Job every minute.
 * 
 * 1. Finds all posts where status = 'scheduled' AND scheduled_at <= NOW()
 * 2. For each post, retrieves the user's access token for each target platform
 * 3. Calls the appropriate platform API
 * 4. Logs the result and updates the post status
 */
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (in production)
  const authHeader = request.headers.get('authorization')
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  try {
    // Step 1: Find posts ready to be published
    const now = new Date().toISOString()
    const { data: postsToPublish, error: fetchError } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)
      .limit(10) // Process 10 at a time to avoid timeouts

    if (fetchError) {
      console.error('Error fetching posts:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!postsToPublish || postsToPublish.length === 0) {
      return NextResponse.json({ message: 'No posts to publish', count: 0 })
    }

    const results = []

    for (const post of postsToPublish) {
      // Mark as publishing
      await supabase
        .from('scheduled_posts')
        .update({ status: 'publishing', updated_at: new Date().toISOString() })
        .eq('id', post.id)

      const platforms: string[] = post.platforms || []
      let allSucceeded = true
      const platformResults = []

      for (const platform of platforms) {
        // Get the user's access token for this platform
        const providerName = platform === 'instagram' ? 'facebook' : platform
        const { data: accounts } = await supabase
          .from('social_accounts')
          .select('*')
          .eq('user_id', post.user_id)
          .eq('provider', providerName)
          .limit(1)

        if (!accounts || accounts.length === 0) {
          const logEntry = {
            post_id: post.id,
            platform,
            status: 'failed',
            error_message: `No ${platform} account connected. Please connect your account in the Accounts page.`,
          }
          await supabase.from('publish_logs').insert(logEntry)
          platformResults.push(logEntry)
          allSucceeded = false
          continue
        }

        const account = accounts[0]
        let result

        // Call the appropriate platform API
        switch (platform) {
          case 'facebook':
            result = await publishToFacebook(
              account.access_token,
              post.caption,
              post.media_url,
              post.media_type,
              account.metadata
            )
            break

          case 'linkedin':
            result = await publishToLinkedIn(
              account.access_token,
              post.caption,
              post.media_url,
              post.media_type,
              account.metadata
            )
            break

          case 'instagram':
            result = await publishToInstagram(
              account.access_token,
              post.caption,
              post.media_url,
              post.media_type,
              account.metadata
            )
            break

          default:
            result = {
              success: false,
              error: `Unsupported platform: ${platform}`,
            }
        }

        // Log the result
        const logEntry = {
          post_id: post.id,
          platform,
          status: result.success ? 'success' : 'failed',
          response_code: result.responseCode,
          response_body: result.responseBody,
          error_message: result.error,
        }
        await supabase.from('publish_logs').insert(logEntry)
        platformResults.push(logEntry)

        if (!result.success) {
          allSucceeded = false
        }
      }

      // Update post status
      const newStatus = allSucceeded ? 'published' : 'failed'
      const errorMsg = allSucceeded
        ? null
        : platformResults
            .filter((r) => r.status === 'failed')
            .map((r) => `${r.platform}: ${r.error_message}`)
            .join('; ')

      await supabase
        .from('scheduled_posts')
        .update({
          status: newStatus,
          published_at: allSucceeded ? new Date().toISOString() : null,
          error_message: errorMsg,
          updated_at: new Date().toISOString(),
        })
        .eq('id', post.id)

      results.push({
        postId: post.id,
        status: newStatus,
        platforms: platformResults,
      })
    }

    return NextResponse.json({
      message: `Processed ${results.length} posts`,
      results,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Publish engine error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
