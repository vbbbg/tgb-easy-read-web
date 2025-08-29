import { createClient } from '@/lib/supabase/server' // 确保导入的是服务端 client

/**
 * 根据楼层号获取单条评论数据的公共方法
 * @param floorNumber - 要查询的楼层号
 * @returns 返回评论对象或 null
 */
export async function getCommentByFloor(floorNumber: number) {
  const supabase = await createClient()

  // 2. 执行查询
  const { data: comment, error } = await supabase
    .from('comments')
    .select('*')
    .eq('floor', floorNumber)
    .maybeSingle()

  // 3. 错误处理
  if (error) {
    throw new Error('获取评论数据失败，请检查服务器日志。')
  }

  // 4. 返回查询结果
  return comment
}
