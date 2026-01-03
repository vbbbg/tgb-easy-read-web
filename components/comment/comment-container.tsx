"use client"

import { getFormValuesFromWindowUrl } from "@/components/comment/comment-controls"
import { useEffect } from "react"
import { CommentList } from "@/components/comment/comment-list"
import useComment from "@/hooks/use-comment"
import useObserver from "@/hooks/use-observer"
import { useImageObserver } from "@/hooks/use-image-observer"
import { VisibleImagePreview } from "@/components/comment/visible-image-preview"

import { useSearchParams } from "next/navigation"

export function CommentContainer() {
  const searchParams = useSearchParams()
  const postId = searchParams.get("post_id") || "2hIcnFHiTnx"
  const { comments, isLoading, hasMore, handleFilterChange, loadMoreComments } =
    useComment([], postId)

  const { observerRef } = useObserver(async () => {
    if (isLoading) return

    if (hasMore) {
      await loadMoreComments(getFormValuesFromWindowUrl())
    }
  })

  useEffect(() => {
    loadMoreComments(getFormValuesFromWindowUrl()).then()
  }, [])

  useEffect(() => {
    const onLocationChange = async () => {
      await handleFilterChange(getFormValuesFromWindowUrl())
    }

    window.addEventListener("popstate", onLocationChange)

    return () => {
      window.removeEventListener("popstate", onLocationChange)
    }
  }, [])

  const { visibleImageData, containerRef } = useImageObserver(comments)

  return (
    <div ref={containerRef}>
      <CommentList
        comments={comments}
        isLoading={isLoading}
        hasMore={hasMore}
        lastCommentElementRef={observerRef}
      />
      <VisibleImagePreview visibleImageData={visibleImageData} />
    </div>
  )
}
