import { useCallback, useRef } from "react"

export default function useObserver(callback: () => void) {
  const observer = useRef<IntersectionObserver>(undefined)

  const observerRef = useCallback((node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback()
      }
    })
    if (node) observer.current.observe(node)
  }, [])

  return { observerRef }
}
