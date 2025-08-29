'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

// 假设 Comment 类型，需要根据你的数据库表结构来定义
type Comment = {
  id: number
  floor: number
  user: string
  time: string
  is_op: boolean
  content: {
    text: string
    image?: string
  }
  quote: any
  created_at: string
}

async function fetchComments(
  page: number,
  isAuthorOnly: boolean,
): Promise<Comment[]> {
  const response = await fetch(
    `/api/comments?page=${page}&isAuthorOnly=${isAuthorOnly}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch comments')
  }
  return response.json()
}

export function CommentList({ initialComments }: { initialComments: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [page, setPage] = useState(2) // 初始加载第一页，所以下一页是 2
  const [isAuthorOnly, setIsAuthorOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialComments.length > 0)

  const observer = useRef<IntersectionObserver>()
  const lastCommentElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreComments()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore],
  )

  const loadMoreComments = async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    const newComments = await fetchComments(page, isAuthorOnly)
    if (newComments.length > 0) {
      setComments(prevComments => [...prevComments, ...newComments])
      setPage(prevPage => prevPage + 1)
    } else {
      setHasMore(false)
    }
    setIsLoading(false)
  }

  const handleAuthorOnlyChange = async (checked: boolean) => {
    setIsAuthorOnly(checked)
    setPage(1)
    setComments([])
    setHasMore(true)
    setIsLoading(true)
    const newComments = await fetchComments(1, checked)
    setComments(newComments)
    setPage(2)
    setIsLoading(false)
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="author-only"
          checked={isAuthorOnly}
          onCheckedChange={handleAuthorOnlyChange}
        />
        <Label htmlFor="author-only">仅看楼主</Label>
      </div>

      <div className="space-y-4">
        {comments.map((comment, index) => (
          <Card
            ref={comments.length === index + 1 ? lastCommentElementRef : null}
            key={comment.id}
          >
            <CardHeader>
              <div>
                <CardTitle>{comment.user}</CardTitle>
                <CardDescription>#{comment.floor}楼</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>{comment.content.text}</p>
              {comment.content.image && (
                <img
                  src={comment.content.image}
                  alt="Comment image"
                  className="mt-4 rounded-md"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && <p className="text-center mt-4">加载中...</p>}
      {!hasMore && <p className="text-center mt-4">没有更多了</p>}
    </div>
  )
}
