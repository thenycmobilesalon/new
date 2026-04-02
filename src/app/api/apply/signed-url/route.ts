import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ALLOWED_TYPES: Record<string, { mimes: string[]; maxSize: number; folder: string }> = {
  resume: {
    mimes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: 10 * 1024 * 1024,
    folder: 'applications/resumes',
  },
  video: {
    mimes: ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v'],
    maxSize: 100 * 1024 * 1024,
    folder: 'applications/videos',
  },
}

export async function POST(request: NextRequest) {
  try {
    const { type, filename, contentType } = await request.json()

    const config = ALLOWED_TYPES[type]
    if (!config) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }

    if (!contentType || !config.mimes.includes(contentType)) {
      return NextResponse.json({ error: `Invalid file type for ${type}` }, { status: 400 })
    }

    const ext = (filename?.split('.').pop() || 'bin').toLowerCase()
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const path = `${config.folder}/${timestamp}-${randomId}.${ext}`

    const { data, error } = await supabaseAdmin.storage
      .from('uploads')
      .createSignedUploadUrl(path)

    if (error) {
      console.error('Signed URL error:', JSON.stringify(error))
      return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 })
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(path)

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path,
      publicUrl: urlData.publicUrl,
    })
  } catch (err) {
    console.error('Signed URL error:', err)
    return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 })
  }
}
