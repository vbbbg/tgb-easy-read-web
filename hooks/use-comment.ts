import type { Comment } from "@/components/comment/comment-item"
import { useCallback, useRef, useState } from "react"
import { FormValue } from "@/components/comment/comment-controls"

async function fetchComments(
  page: number,
  isAuthorOnly: boolean,
  ascending: boolean,
  postId: string,
  date?: number,
): Promise<Comment[]> {
  const response = await fetch(
    `/api/comments?page=${page}&isAuthorOnly=${isAuthorOnly}&ascending=${ascending}&date=${date}&post_id=${postId}`,
  )
  if (!response.ok) {
    throw new Error("Failed to fetch comments")
  }
  return response.json()
}

export default function useComment(initialComments: Comment[], postId: string) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const pageRef = useRef(1)

  const loadMoreComments = useCallback(
    async ({ ascending, authorOnly, date }: FormValue) => {
      if (isLoading || !hasMore) return
      setIsLoading(true)

      const newComments = await fetchComments(
        pageRef.current,
        authorOnly,
        ascending,
        postId,
        date,
      )
      if (newComments.length > 0) {
        setComments((prevComments) => [...prevComments, ...newComments])

        pageRef.current += 1
      } else {
        setHasMore(false)
      }
      setIsLoading(false)
    },
    [postId, isLoading, hasMore],
  )

  const handleFilterChange = async ({
    ascending,
    authorOnly,
    date,
  }: FormValue) => {
    pageRef.current = 1
    setComments([])
    setHasMore(true)
    setIsLoading(true)
    const newComments = await fetchComments(
      1,
      authorOnly,
      ascending,
      postId,
      date,
    )
    setComments(newComments)
    setIsLoading(false)

    pageRef.current += 1
  }

  return {
    comments,
    isLoading,
    hasMore,
    handleFilterChange,
    loadMoreComments,
  }
}
