import { cache } from 'react'
import { getCommentByFloor } from '@/lib/supabase/data-helper'

const cachaGetCommentByFloor = cache(getCommentByFloor)
export default async function () {
  const a = await cachaGetCommentByFloor(1)
  console.log(a)
  // 1. 显示 楼主帖子，固定显示
  // 2. 显示网友跟帖，非 floorNumber === 1
  // 3. 网友跟帖，滚动加载，加载到底部继续加载下一页
  // 4. 仅看楼主功能，点击仅显示楼主跟帖
  return null
}
