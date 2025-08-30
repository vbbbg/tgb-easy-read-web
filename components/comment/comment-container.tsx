"use client"

import { getFormValuesFromWindowUrl } from "@/components/comment/comment-controls"
import { useEffect } from "react"
import { CommentList } from "@/components/comment/comment-list"
import useComment from "@/hooks/use-comment"
import useObserver from "@/hooks/use-observer"

export function CommentContainer() {
  const { comments, isLoading, hasMore, handleFilterChange, loadMoreComments } =
    useComment([])

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

  return (
    <CommentList
      comments={comments}
      isLoading={isLoading}
      hasMore={hasMore}
      lastCommentElementRef={observerRef}
    />
  )
}
