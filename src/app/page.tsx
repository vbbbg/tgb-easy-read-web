// app/page.tsx

// 1. **"use client" 指令 (关键修复)**
// 这行代码必须放在文件的最顶端。
// 它告诉 Next.js 这个文件是一个客户端组件，因此可以在其中使用 useState, useEffect 等 React Hooks。
'use client'

import { useEffect, useState, useRef } from 'react'
// 修复：将 @supabase/ssr 替换为通用的 @supabase/supabase-js
// 请确保已安装此依赖: npm install @supabase/supabase-js
import { createClient } from '@supabase/supabase-js'

// 导入 UI 组件和图标
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { X, Loader2 } from 'lucide-react' // 请确保已安装此依赖: npm install lucide-react

// 2. 数据类型定义
interface ContentData {
  text: string
  image?: string | null
}

interface QuoteData {
  time: string
  user: string
  content: ContentData
}

export interface Comment {
  id: number
  floor: number
  user: string
  time: string
  is_op: boolean
  content: ContentData
  quote: QuoteData | null
  created_at: string
}

// ------------------- 子组件定义区 -------------------

// 引用块组件
function QuoteBlock({ quote }: { quote: QuoteData }) {
  return (
    <div className="mb-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
      <p className="font-semibold">引用 @{quote.user} 的发言：</p>
      <blockquote className="mt-2 border-l-2 border-gray-300 pl-3 italic dark:border-gray-600">
        <p>{quote.content.text}</p>
        {quote.content.image && (
          <div className="mt-2">
            {/* 修复：将 Next.js 的 Image 组件替换为标准的 img 标签 */}
            <img
              src={quote.content.image}
              alt="引用图片"
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
          </div>
        )}
      </blockquote>
    </div>
  )
}

// 单条评论组件
function CommentItem({
  comment,
  onReply,
}: {
  comment: Comment
  onReply: (comment: Comment) => void
}) {
  return (
    <Card
      id={`floor-${comment.floor}`}
      className="mb-4 border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar className="mt-1">
          <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p
              className={`font-semibold ${comment.is_op ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}
            >
              {comment.user} {comment.is_op && '(楼主)'}
            </p>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              #{comment.floor}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(comment.time).toLocaleString()}
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {comment.quote && <QuoteBlock quote={comment.quote} />}
        <div className="text-base text-gray-800 dark:text-gray-200">
          <p className="whitespace-pre-wrap">{comment.content.text}</p>
          {comment.content.image && (
            <div className="mt-3">
              {/* 修复：将 Next.js 的 Image 组件替换为标准的 img 标签 */}
              <img
                src={comment.content.image}
                alt="评论图片"
                width={120}
                height={120}
                className="max-h-48 w-auto rounded-md object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => onReply(comment)}>
            回复
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ------------------- 主页面组件 -------------------

export default function CommentPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quoteTarget, setQuoteTarget] = useState<Comment | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // 修复：使用 @supabase/supabase-js 的 createClient
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  // 在客户端获取初始数据
  useEffect(() => {
    const getComments = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error)
      } else {
        setComments(data as Comment[])
      }
      setIsLoading(false)
    }

    getComments()
  }, [supabase])

  // 实时更新
  useEffect(() => {
    const channel = supabase
      .channel('realtime comments v3')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          setComments((prevComments) => [
            ...prevComments,
            payload.new as Comment,
          ])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // 处理点击回复
  const handleReplyClick = (comment: Comment) => {
    setQuoteTarget(comment)
    textareaRef.current?.focus()
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  // 处理表单提交
  const handleFormSubmit = async (formData: FormData) => {
    const content = formData.get('content') as string
    if (!content.trim() || isPosting) return

    setIsPosting(true)

    const { data: maxFloorData, error: maxFloorError } = await supabase
      .from('comments')
      .select('floor')
      .order('floor', { ascending: false })
      .limit(1)
      .single()

    if (maxFloorError) {
      console.error('Error fetching max floor:', maxFloorError)
      setIsPosting(false)
      return
    }

    const newFloor = (maxFloorData?.floor || 0) + 1

    const newCommentData: any = {
      floor: newFloor,
      user: '匿名用户',
      is_op: false,
      content: { text: content },
      quote: null,
    }

    if (quoteTarget) {
      newCommentData.quote = {
        time: quoteTarget.time,
        user: quoteTarget.user,
        content: quoteTarget.content,
      }
    }

    const { error: insertError } = await supabase
      .from('comments')
      .insert(newCommentData)

    if (insertError) {
      console.error('Error posting comment:', insertError)
    } else {
      if (textareaRef.current) textareaRef.current.value = ''
      setQuoteTarget(null)
    }
    setIsPosting(false)
  }

  const opPost = comments.find((c) => c.floor === 1)
  const replies = comments
    .filter((c) => c.floor !== 1)
    .sort((a, b) => a.floor - b.floor)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="container mx-auto max-w-3xl p-4 md:p-8">
        {opPost ? (
          <CommentItem comment={opPost} onReply={handleReplyClick} />
        ) : (
          <p>楼主帖子加载中...</p>
        )}

        <hr className="my-8 border-gray-200 dark:border-gray-800" />

        {replies.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReplyClick}
          />
        ))}

        <div className="sticky bottom-0 mt-8 bg-gray-50/80 pb-4 backdrop-blur-sm dark:bg-gray-950/80">
          <Card className="shadow-lg dark:bg-gray-900">
            <CardContent className="p-4">
              {quoteTarget && (
                <div className="mb-2 flex items-center justify-between rounded-md bg-gray-100 p-2 text-sm dark:bg-gray-800">
                  <p className="text-gray-600 dark:text-gray-300">
                    正在回复 #{quoteTarget.floor} @{quoteTarget.user}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setQuoteTarget(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <form action={handleFormSubmit}>
                <Textarea
                  ref={textareaRef}
                  name="content"
                  placeholder="发表你的看法..."
                  className="mb-3 text-base"
                  rows={4}
                  required
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isPosting}>
                    {isPosting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    发表跟帖
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
