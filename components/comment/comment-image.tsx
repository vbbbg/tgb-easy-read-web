"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ImagePreviewOverlayProps {
  imageUrl: string
}

export function CommentImage({ imageUrl }: ImagePreviewOverlayProps) {
  const [showImage, setShowImage] = useState(false)

  return (
    <>
      {!showImage && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setShowImage(true)}
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
