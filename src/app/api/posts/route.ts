import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * GET /api/posts — Fetch all scheduled posts for the logged-in user
 * Supports query params: ?status=scheduled&limit=50
 */
export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '50', 10)

  let query = supabase
    .from('scheduled_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('scheduled_at', { ascending: true })
    .limit(limit)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ posts: data })
}

/**
 * POST /api/posts — Create a new scheduled post
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { caption, media_url, media_type, platforms, post_type, scheduled_at } = body

    if (!caption || !platforms || platforms.length === 0 || !scheduled_at) {
      return NextResponse.json(
        { error: 'Missing required fields: caption, platforms, scheduled_at' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('scheduled_posts')
      .insert({
        user_id: user.id,
        caption,
        media_url: media_url || null,
        media_type: media_type || 'image',
        platforms,
        post_type: post_type || 'post',
        status: 'scheduled',
        scheduled_at,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

/**
 * DELETE /api/posts — Delete a scheduled post
 * Body: { id: "post-uuid" }
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
      return NextResponse.json({ error: 'Missing post id' }, { status: 400 })
    }

    const { error } = await supabase
      .from('scheduled_posts')
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
