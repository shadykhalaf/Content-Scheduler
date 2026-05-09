import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // If Supabase or the provider returned an error, redirect to login with the message
  if (errorParam || errorDescription) {
    const errorMessage = errorDescription || errorParam || 'Authentication failed'
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // ============================================================
      // CRITICAL: Extract and store the provider access token
      // This is what allows us to post on behalf of the user later
      // ============================================================
      const session = data.session
      const providerToken = session.provider_token
      const providerRefreshToken = session.provider_refresh_token
      const user = session.user

      if (providerToken && user) {
        // Determine the provider from user metadata
        const provider = user.app_metadata?.provider || 'unknown'
        const providerAccountId = user.user_metadata?.provider_id 
          || user.user_metadata?.sub 
          || user.id
        const accountName = user.user_metadata?.full_name 
          || user.user_metadata?.name 
          || user.email 
          || 'Unknown'
        const avatarUrl = user.user_metadata?.avatar_url 
          || user.user_metadata?.picture 
          || null

        // Upsert the social account with the access token
        const { error: upsertError } = await supabase
          .from('social_accounts')
          .upsert(
            {
              user_id: user.id,
              provider: provider,
              provider_account_id: String(providerAccountId),
              account_name: accountName,
              access_token: providerToken,
              refresh_token: providerRefreshToken || null,
              avatar_url: avatarUrl,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'user_id,provider,provider_account_id',
            }
          )

        if (upsertError) {
          console.error('Error storing provider token:', upsertError)
          // Don't block login if token storage fails — just log it
        } else {
          console.log(`✅ Stored ${provider} access token for user ${user.id}`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    } else if (error) {
      console.error('Supabase exchangeCodeForSession error:', error)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  // Return the user to login with an error
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate`)
}
