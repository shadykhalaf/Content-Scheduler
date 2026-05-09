import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/accounts — Fetch all connected social accounts for the logged-in user
 */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('social_accounts')
    .select('id, provider, provider_account_id, account_name, avatar_url, token_expires_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ accounts: data })
}

/**
 * DELETE /api/accounts — Disconnect a social account
 * Body: { id: "account-uuid" }
 */
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing account id' }, { status: 400 })
    }

    const { error } = await supabase
      .from('social_accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
