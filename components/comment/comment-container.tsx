"use client"

import {
  CommentControls,
  FormValue,
} from "@/components/comment/comment-controls"
import { useRef } from "react"
import { UseFormReturn } from "react-hook-form"
import type { Comment } from "@/components/comment/comment-item"
import { CommentList } from "@/components/comment/comment-list"
import useComment from "@/hooks/useComment"
import useObserver from "@/hooks/useObserver"

export function CommentContainer({
  initialComments,
}: {
  initialComments: Comment[]
}) {
  const controlsRef = useRef<{ form: UseFormReturn<FormValue> }>(undefined)

  const { comments, isLoading, hasMore, handleFilterChange, loadMoreComments } =
    useComment(initialComments)

  const { observerRef } = useObserver(async () => {
    if (isLoading) return

    if (hasMore) {
      await loadMoreComments(controlsRef.current?.form?.getValues()!)
    }
  })

  controlsRef.current?.form?.subscribe({
    formState: {
      values: true,
    },
    callback: async (value) => {
      const name = value.name as keyof FormValue
      switch (name) {
        case "authorOnly":
        case "ascending":
          await handleFilterChange(value.values)
          break
        default:
          break
      }
    },
  })

  return (
    <div>
      <CommentControls ref={controlsRef} />
      <CommentList
        comments={comments}
        isLoading={isLoading}
        hasMore={hasMore}
        lastCommentElementRef={observerRef}
      />
    </div>
  )
}
