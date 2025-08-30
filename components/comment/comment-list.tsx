"use client"

import { CommentItem, type Comment } from "./comment-item"

export function CommentList({
  comments,
  isLoading,
  hasMore,
  lastCommentElementRef,
}: {
  comments: Comment[]
  isLoading: boolean
  hasMore: boolean
  lastCommentElementRef?: (node: HTMLDivElement) => void
}) {
  return (
    <div>
      {comments.map((comment, index) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          lastCommentElementRef={
            comments.length === index + 1 ? lastCommentElementRef : null
          }
        />
      ))}

      {isLoading && <p className="text-center mt-4">加载中...</p>}
      {!hasMore && <p className="text-center mt-4">没有更多了</p>}
    </div>
  )
}
