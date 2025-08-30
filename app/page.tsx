import { getCommentByFloor } from "@/lib/supabase/data-helper"
import { cache } from "react"
import {
  type Comment,
  CommentItem as MainPost,
} from "@/components/comment/comment-item"
import { CommentContainer } from "@/components/comment/comment-container"
import { CommentControls } from "@/components/comment/comment-controls"

const cacheGetCommentByFloor = cache(getCommentByFloor)

export default async function Page() {
  const mainComment = (await cacheGetCommentByFloor(1)) as Comment

  if (!mainComment) {
    return <div>主楼帖子不存在</div>
  }

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="flex justify-center gap-3">
        <div className="max-w-screen-md">
          <MainPost comment={mainComment} />
          <CommentContainer />
        </div>
        <div className="sticky top-2 sm:top-4 h-fit">
          <CommentControls />
        </div>
      </div>
    </div>
  )
}
