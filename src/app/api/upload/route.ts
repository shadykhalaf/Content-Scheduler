import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * POST /api/upload — Upload media to Supabase Storage
 * Expects multipart/form-data with a 'file' field
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
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (50MB max)
    const MAX_SIZE = 50 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'video/webm',
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, GIF, WebP, MP4, MOV, WebM' },
        { status: 400 }
      )
    }

    // Generate a unique filename
    const ext = file.name.split('.').pop() || 'bin'
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const fileName = `${user.id}/${timestamp}-${random}.${ext}`

    // Determine media type
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image'

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(uploadData.path)

    return NextResponse.json({
      url: urlData.publicUrl,
      path: uploadData.path,
      mediaType,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Upload handler error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
