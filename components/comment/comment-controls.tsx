"use client"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Eraser } from "lucide-react"

export interface FormValue {
  authorOnly: boolean
  ascending: boolean
  date?: number
}

export const CommentControls = () => {
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)

  const form = useForm<FormValue>({
    defaultValues: { authorOnly: false, ascending: false, date: undefined },
  })

  useEffect(() => {
    form.reset(getFormValuesFromWindowUrl())
  }, [searchParams, form])

  useEffect(() => {
    form.subscribe({
      formState: {
        values: true,
      },
      callback: async (value) => {
        const name = value.name as keyof FormValue
        switch (name) {
          case "date":
          case "authorOnly":
          case "ascending":
            const values = value.values
            const newSearchParams = new URLSearchParams(searchParams.toString())

            newSearchParams.set("authorOnly", String(values.authorOnly))
            newSearchParams.set("ascending", String(values.ascending))
            if (values.date) {
              newSearchParams.set("date", String(values.date))
            } else {
              newSearchParams.delete("date")
            }

            // router.push(`?${newSearchParams.toString()}`)
            window.history.pushState(null, "", `?${newSearchParams.toString()}`)

            // communicate to Routes that URL has changed
            const navEvent = new PopStateEvent("popstate")
            window.dispatchEvent(navEvent)
            break
          default:
            break
        }
      },
    })
  }, [])

  return (
    <Form {...form}>
      <div className="space-y-4 mb-4">
        <FormField
          control={form.control}
          name="authorOnly"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>仅看楼主</FormLabel>
                <FormDescription>开启后，将只显示楼主的评论。</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ascending"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>排序</FormLabel>
                <FormDescription>
                  切换为 {field.value ? "倒序" : "正序"} 查看
                </FormDescription>
              </div>
              <FormControl>
                <Button
                  variant="outline"
                  onClick={() => field.onChange(!field.value)}
                >
                  {field.value ? "正序" : "倒序"}
                </Button>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <div className="flex text-sm items-center gap-2">
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      {field.value
                        ? new Date(field.value).toLocaleDateString()
                        : "按日期进行查看"}
                    </Button>
                    <Eraser
                      className="cursor-pointer"
                      width={18}
                      onClick={(e) => {
                        e.preventDefault()
                        field.onChange(undefined)
                      }}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={new Date(field.value || 0)}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      field.onChange(date?.getTime())
                      setOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}

export function getFormValuesFromWindowUrl(): FormValue {
  if (typeof window === "undefined")
    return { authorOnly: false, ascending: false }

  const searchParams = new URLSearchParams(window?.location?.search)
  const authorOnly = searchParams.get("authorOnly") === "true"
  const ascending = searchParams.get("ascending") === "true"
  const date = searchParams.get("date")
    ? Number(searchParams.get("date"))
    : undefined
  return { authorOnly, ascending, date }
}
