import { createClient } from "@/lib/supabase/server"
import { startOfDay, endOfDay } from "date-fns" // 确保导入的是服务端 client

/**
 * 根据楼层号获取单条评论数据的公共方法
 * @param floorNumber - 要查询的楼层号
 * @param postId - 帖子 ID
 * @returns 返回评论对象或 null
 */
export async function getCommentByFloor(floorNumber: number, postId: string) {
  const supabase = await createClient()

  // 2. 执行查询
  const { data: comment, error } = await supabase
    .from("comments")
    .select("*")
    .eq("floor", floorNumber)
    .eq("post_id", postId)
    .maybeSingle()

  // 3. 错误处理
  if (error) {
    throw new Error("获取评论数据失败，请检查服务器日志。")
  }

  // 4. 返回查询结果
  return comment
}

/**
 * 获取评论列表的公共方法
 * @param page - 页码
 * @param pageSize - 每页数量
 * @param isAuthorOnly - 是否只看楼主
 * @param ascending - 是否升序
 * @param postId - 帖子 ID
 * @param date - 查询日期
 * @returns 返回评论列表
 */
export async function getComments(
  page: number,
  pageSize: number,
  isAuthorOnly: boolean,
  ascending: boolean,
  postId: string,
  date?: number,
) {
  const supabase = await createClient()

  // 1. 构建查询
  let query = supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("floor", { ascending })
    .range((page - 1) * pageSize, page * pageSize - 1)
    .neq("floor", 1)

  // 2. 如果 isAuthorOnly 为 true，则添加过滤条件
  if (isAuthorOnly) {
    query = query.eq("is_op", true)
  }
  // 3. 如果传入了 date，则查询对应日期的评论
  if (date) {
    const selectedDate = new Date(date) // Assuming date is a timestamp in milliseconds
    const start = startOfDay(selectedDate).toLocaleString("en-US", {
      timeZone: "Asia/Shanghai",
    })
    query = query.gte("time", start)
  }

  // 4. 执行查询
  const { data: comments, error } = await query

  // 4. 错误处理
  if (error) {
    throw new Error("获取评论列表失败，请检查服务器日志。")
  }

  // 5. 返回查询结果
  return comments
}

/**
 * 获取帖子列表 (主楼评论)
 * @returns 返回帖子列表
 */
export async function getPosts() {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from("comments")
    .select("post_id, content, time, user")
    .eq("floor", 1)
    .order("time", { ascending: false })

  if (error) {
    throw new Error("获取帖子列表失败，请检查服务器日志。")
  }

  return posts
}

