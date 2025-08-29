import { NextResponse } from 'next/server'
import { getComments } from '@/lib/supabase/data-helper'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || '1')
  const isAuthorOnly = searchParams.get('isAuthorOnly') === 'true'

  try {
    const comments = await getComments(page, 10, isAuthorOnly)
    return NextResponse.json(comments)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    )
  }
}
