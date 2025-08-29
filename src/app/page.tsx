import { cache } from 'react'
import { getCommentByFloor } from '@/lib/supabase/data-helper'

const cachaGetCommentByFloor = cache(getCommentByFloor)
export default async function () {
  const a = await cachaGetCommentByFloor(1)
  console.log(a)

  return null
}
