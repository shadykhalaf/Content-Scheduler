// Facebook Graph API Publishing Helper
// Docs: https://developers.facebook.com/docs/pages-api/posts

interface PublishResult {
  success: boolean
  postId?: string
  error?: string
  responseCode?: number
  responseBody?: string
}

/**
 * Publish a post to a Facebook Page using the Graph API.
 * 
 * Required Permissions (need App Review):
 * - pages_manage_posts
 * - pages_read_engagement
 * 
 * For the admin/developer of the app, these work in Development Mode.
 */
export async function publishToFacebook(
  accessToken: string,
  caption: string,
  mediaUrl?: string,
  mediaType?: string,
  metadata?: Record<string, unknown>
): Promise<PublishResult> {
  try {
    // Step 1: Get the user's pages (we need the Page ID and Page Access Token)
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`
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

    if (!pagesData.data || pagesData.data.length === 0) {
      return {
        success: false,
        error: 'No Facebook Pages found. You need to have a Facebook Page connected to your account.',
        responseCode: 200,
        responseBody: JSON.stringify(pagesData),
      }
    }

    // Use the first page (or the one specified in metadata)
    const targetPageId = (metadata?.page_id as string) || pagesData.data[0].id
    const page = pagesData.data.find((p: { id: string }) => p.id === targetPageId) || pagesData.data[0]
    const pageAccessToken = page.access_token
    const pageId = page.id

    // Step 2: Post to the page
    if (mediaUrl && mediaType === 'video') {
      // Video post
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${pageId}/videos`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file_url: mediaUrl,
            description: caption,
            access_token: pageAccessToken,
          }),
        }
      )
      const data = await response.json()
      
      if (data.error) {
        return {
          success: false,
          error: data.error.message,
          responseCode: response.status,
          responseBody: JSON.stringify(data),
        }
      }

      return {
        success: true,
        postId: data.id,
        responseCode: response.status,
        responseBody: JSON.stringify(data),
      }
    } else if (mediaUrl && mediaType === 'image') {
      // Photo post
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${pageId}/photos`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: mediaUrl,
            message: caption,
            access_token: pageAccessToken,
          }),
        }
      )
      const data = await response.json()
      
      if (data.error) {
        return {
          success: false,
          error: data.error.message,
          responseCode: response.status,
          responseBody: JSON.stringify(data),
        }
      }

      return {
        success: true,
        postId: data.id,
        responseCode: response.status,
        responseBody: JSON.stringify(data),
      }
    } else {
      // Text-only post
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${pageId}/feed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: caption,
            access_token: pageAccessToken,
          }),
        }
      )
      const data = await response.json()
      
      if (data.error) {
        return {
          success: false,
          error: data.error.message,
          responseCode: response.status,
          responseBody: JSON.stringify(data),
        }
      }

      return {
        success: true,
        postId: data.id,
        responseCode: response.status,
        responseBody: JSON.stringify(data),
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: `Network error: ${message}`,
    }
  }
}
