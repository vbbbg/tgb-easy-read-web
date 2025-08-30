import { getCommentByFloor, getComments } from "@/lib/supabase/data-helper"
import { cache } from "react"
import {
  type Comment,
  CommentItem as MainPost,
} from "@/components/comment/comment-item"
import { CommentContainer } from "@/components/comment/comment-container"

const cacheGetCommentByFloor = cache(getCommentByFloor)

export default async function Page() {
  const mainComment = (await cacheGetCommentByFloor(1)) as Comment
  const initialComments = await getComments(1, 10, false, false) // Fetch in descending order

  if (!mainComment) {
    return <div>主楼帖子不存在</div>
  }

  return (
    <div className="container max-w-screen-md mx-auto p-2 sm:p-4">
      <MainPost comment={mainComment} />
      <CommentContainer initialComments={initialComments} />
    </div>
  )
}
