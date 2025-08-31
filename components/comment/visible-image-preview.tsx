"use client"

import { VisibleImageData } from "@/hooks/use-image-observer"
import { format } from "date-fns"

interface VisibleImagePreviewProps {
  visibleImageData: VisibleImageData[]
}

export function VisibleImagePreview({
  visibleImageData,
}: VisibleImagePreviewProps) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-row items-end gap-4 z-50">
      {visibleImageData.map(({ url, text, time }) => (
        <div
          key={url + time} // More unique key
          className="animate-in fade-in slide-in-from-right-4 duration-500 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg w-60"
        >
          <img
            src={url}
            alt="Visible Comment Image"
            className="w-full rounded-md shadow-inner"
          />
          <div className="mt-2 text-gray-700 dark:text-gray-300">
            <p className="text-xs truncate">{text}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {format(new Date(time), "yyyy-MM-dd")}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
