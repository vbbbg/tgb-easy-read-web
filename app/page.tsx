import { getCommentByFloor, getComments } from '@/lib/supabase/data-helper'
import { cache } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CommentList } from '@/app/comment-list'

const cacheGetCommentByFloor = cache(getCommentByFloor)

export default async function Page() {
  const mainComment = await cacheGetCommentByFloor(1)
  const initialComments = await getComments(1, 10, false)

  if (!mainComment) {
    return <div>主楼帖子不存在</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>{mainComment.user}</CardTitle>
            <CardDescription>楼主</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p>{mainComment.content.text}</p>
          {mainComment.content.image && (
            <img
              src={mainComment.content.image}
              alt="Comment image"
              className="mt-4 rounded-md"
            />
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            {new Date(mainComment.created_at).toLocaleString()}
          </div>
        </CardFooter>
      </Card>

      <div className="mt-4">
        <CommentList initialComments={initialComments} />
      </div>
    </div>
  )
}