"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Post {
  post_id: string
  content: {
    text: string
  }
  time: string
  user: string
}

interface PostSidebarProps {
  posts: Post[]
}

export function PostSidebar({ posts }: PostSidebarProps) {
  const searchParams = useSearchParams()
  const currentPostId = searchParams.get("post_id") || "2hIcnFHiTnx"

  return (
    <div className="w-64 border-r bg-gray-50/50 dark:bg-gray-900/50 flex flex-col h-[calc(100vh-2rem)] sticky top-4 rounded-xl overflow-hidden">
      <div className="p-4 border-b bg-white dark:bg-gray-950">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">帖子列表</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {posts.map((post) => {
            const isActive = post.post_id === currentPostId
            return (
              <Link
                key={post.post_id}
                href={`?post_id=${post.post_id}`}
                className={cn(
                  "block p-3 rounded-lg transition-colors text-sm",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <div className="line-clamp-2 mb-1">
                  {post.content.text || "无标题"}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 flex justify-between">
                  <span>{post.user}</span>
                  <span>{new Date(post.time).toLocaleDateString()}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
