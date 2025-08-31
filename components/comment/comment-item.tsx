import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ClientTime } from "@/components/comment/client-time"
import { CommentImage } from "./comment-image"

export type Quote = {
  time: string
  user: string
  content: {
    text: string
    image?: string // Also allow image in quote for consistency
  }
}

export type Comment = {
  id: number
  floor: number
  user: string
  time: string
  is_op: boolean
  content: {
    text: string
    image?: string
  }
  quote: Quote | null
  created_at: string
}

export function CommentItem({
  comment,
  lastCommentElementRef,
}: {
  comment: Comment
  lastCommentElementRef?: any
}) {
  return (
    <Card
      className="gap-4 mb-4 border-gray-200 dark:border-gray-800 py-6"
      ref={lastCommentElementRef}
      key={comment.id}
    >
      <CardHeader className="flex flex-row items-start gap-4 p-4 py-0">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {comment.user}
            </p>

            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              #{comment.floor}楼
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <ClientTime dateString={comment.time} />
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-2">
        <p className="text-gray-800 dark:text-gray-200">
          {comment.content.text}
        </p>
        {comment.content.image && (
          <CommentImage
            imageUrl={comment.content.image}
            commentText={comment.content.text}
            commentTime={comment.time}
          />
        )}
      </CardContent>

      {comment.quote && (
        <div className="ml-6 border-l-2 border-gray-200 px-4 pt-4 dark:border-gray-800">
          <CommentItem
            comment={{
              // Transform the Quote object into a Comment object
              id: 0, // Using a placeholder ID as it's not a main comment
              floor: 0, // Setting floor to 0 hides the floor number
              user: comment.quote.user,
              time: comment.quote.time,
              is_op: false,
              content: comment.quote.content,
              quote: null, // Assuming quotes are not nested
              created_at: comment.quote.time,
            }}
          />
        </div>
      )}
    </Card>
  )
}
