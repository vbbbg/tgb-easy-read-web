import { getCommentByFloor, getPosts } from "@/lib/supabase/data-helper"
import { cache } from "react"
import {
  type Comment,
  CommentItem as MainPost,
} from "@/components/comment/comment-item"
import { CommentContainer } from "@/components/comment/comment-container"
import { CommentControls } from "@/components/comment/comment-controls"
import { PostSidebar } from "@/components/comment/post-sidebar"

const cacheGetCommentByFloor = cache(getCommentByFloor)
const cacheGetPosts = cache(getPosts)

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const postId = (params.post_id as string) || "2hIcnFHiTnx"

  const [mainComment, posts] = await Promise.all([
    cacheGetCommentByFloor(1, postId) as Promise<Comment>,
    cacheGetPosts(),
  ])

  if (!mainComment) {
    return <div>主楼帖子不存在</div>
  }

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="flex flex-col lg:flex-row justify-center gap-6">
        <aside className="hidden lg:block">
          <PostSidebar posts={posts} />
        </aside>

        <main className="max-w-screen-md w-full">
          <MainPost comment={mainComment} />
          <CommentContainer />
        </main>

        <aside className="sticky top-2 sm:top-4 h-fit hidden xl:block">
          <CommentControls />
        </aside>
      </div>
    </div>
  )
}

