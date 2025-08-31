'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CommentImageProps {
  imageUrl: string
  commentText: string
  commentTime: string
}

export function CommentImage({ imageUrl, commentText, commentTime }: CommentImageProps) {
  const [showImage, setShowImage] = useState(false)

  return (
    <>
      {!showImage && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4 comment-image-placeholder"
          onClick={() => setShowImage(true)}
          data-image-url={imageUrl}
          data-comment-text={commentText}
          data-comment-time={commentTime}
        >
          查看图片
        </Button>
      )}
      {showImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowImage(false)}
        >
          <img
            src={imageUrl}
            alt="Comment image preview"
            className="max-w-[90vw] max-h-[90vh] object-contain cursor-pointer"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
          />
        </div>
      )}
    </>
  )
}