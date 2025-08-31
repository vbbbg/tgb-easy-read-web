import { Comment } from "@/components/comment/comment-item"
import { useEffect, useRef, useState } from "react"

export interface VisibleImageData {
  url: string
  text: string
  time: string
}

export function useImageObserver(comments: Comment[]) {
  const [visibleImageData, setVisibleImageData] = useState<
    Map<HTMLElement, VisibleImageData>
  >(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleImageData(new Map())

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement
          const imageUrl = target.dataset.imageUrl
          const commentText = target.dataset.commentText
          const commentTime = target.dataset.commentTime

          if (!imageUrl || !commentText || !commentTime) return

          setVisibleImageData((prev) => {
            const newVisibleImages = new Map(prev)
            if (entry.isIntersecting) {
              newVisibleImages.set(target, {
                url: imageUrl,
                text: commentText,
                time: commentTime,
              })
            } else {
              newVisibleImages.delete(target)
            }
            return newVisibleImages
          })
        })
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.5, // 50% of the item is visible
      },
    )

    const imagePlaceholders =
      containerRef.current?.querySelectorAll(".comment-image-placeholder") ?? []
    imagePlaceholders.forEach((el) => observer.observe(el))

    return () => {
      imagePlaceholders.forEach((el) => observer.unobserve(el))
    }
  }, [comments]) // Re-run when comments change to observe new items

  return {
    visibleImageData: Array.from(visibleImageData.values()),
    containerRef,
  }
}
