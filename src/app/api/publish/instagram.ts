// Instagram Content Publishing API Helper
// Docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/content-publishing

interface PublishResult {
  success: boolean
  postId?: string
  error?: string
  responseCode?: number
  responseBody?: string
}

/**
 * Publish a post to Instagram using the Instagram Graph API.
 * Instagram posting is a 2-step process:
 * 1. Create a media container
 * 2. Publish the container
 * 
 * Required Permissions (need App Review):
 * - instagram_basic
 * - instagram_content_publish
 * - pages_read_engagement
 * 
 * IMPORTANT: Instagram requires a Business or Creator account connected to a Facebook Page.
 */
export async function publishToInstagram(
  accessToken: string,
  caption: string,
  mediaUrl?: string,
  mediaType?: string,
  metadata?: Record<string, unknown>
): Promise<PublishResult> {
  try {
    // Step 1: Get the Instagram Business Account ID
    // This requires a Facebook Page connected to an Instagram Business account
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,instagram_business_account&access_token=${accessToken}`
    )
    const pagesData = await pagesResponse.json()

    if (pagesData.error) {
      return {
        success: false,
        error: `Facebook API Error: ${pagesData.error.message}`,
        responseCode: pagesResponse.status,
        responseBody: JSON.stringify(pagesData),
      }
    }

    // Find a page with an Instagram business account
    const pageWithIG = pagesData.data?.find(
      (page: { instagram_business_account?: { id: string } }) => page.instagram_business_account
    )

    if (!pageWithIG || !pageWithIG.instagram_business_account) {
      return {
        success: false,
        error: 'No Instagram Business Account found. You need a Facebook Page connected to an Instagram Business/Creator account.',
        responseCode: 200,
        responseBody: JSON.stringify(pagesData),
      }
    }

    const igUserId = pageWithIG.instagram_business_account.id

    if (!mediaUrl) {
      return {
        success: false,
        error: 'Instagram requires media (image or video) for posts. Text-only posts are not supported.',
      }
    }

    // Step 2: Create a media container
    let containerPayload: Record<string, string> = {
      caption,
      access_token: accessToken,
    }

    if (mediaType === 'video') {
      containerPayload = {
        ...containerPayload,
        video_url: mediaUrl,
        media_type: 'REELS', // or VIDEO for feed videos
      }
    } else {
      containerPayload = {
        ...containerPayload,
        image_url: mediaUrl,
      }
    }

    const containerResponse = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(containerPayload),
      }
    )
    const containerData = await containerResponse.json()

    if (containerData.error) {
      return {
        success: false,
        error: `Instagram Container Error: ${containerData.error.message}`,
        responseCode: containerResponse.status,
        responseBody: JSON.stringify(containerData),
      }
    }

    const creationId = containerData.id

    // Step 3: For videos, wait for processing (poll status)
    if (mediaType === 'video') {
      let attempts = 0
      const maxAttempts = 30 // Wait up to 5 minutes
      
      while (attempts < maxAttempts) {
        const statusResponse = await fetch(
          `https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${accessToken}`
        )
        const statusData = await statusResponse.json()
        
        if (statusData.status_code === 'FINISHED') {
          break
        } else if (statusData.status_code === 'ERROR') {
          return {
            success: false,
            error: 'Instagram video processing failed.',
            responseCode: statusResponse.status,
            responseBody: JSON.stringify(statusData),
          }
        }
        
        // Wait 10 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 10000))
        attempts++
      }

      if (attempts >= maxAttempts) {
        return {
          success: false,
          error: 'Instagram video processing timed out after 5 minutes.',
        }
      }
    }

    // Step 4: Publish the container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    )
    const publishData = await publishResponse.json()

    if (publishData.error) {
      return {
        success: false,
        error: `Instagram Publish Error: ${publishData.error.message}`,
        responseCode: publishResponse.status,
        responseBody: JSON.stringify(publishData),
      }
    }

    return {
      success: true,
      postId: publishData.id,
      responseCode: publishResponse.status,
      responseBody: JSON.stringify(publishData),
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: `Network error: ${message}`,
    }
  }
}
