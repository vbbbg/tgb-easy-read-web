"use client"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { useForm, UseFormReturn } from "react-hook-form"
import { RefObject, useImperativeHandle } from "react"

export interface FormValue {
  authorOnly: boolean
  ascending: boolean
}

export const CommentControls = ({
  defaultValues = { authorOnly: false, ascending: false },
  ref,
}: {
  defaultValues?: FormValue
  ref?: RefObject<{ form: UseFormReturn<FormValue> } | undefined>
}) => {
  const form = useForm({ defaultValues })

  useImperativeHandle(ref, () => ({ form }))

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
      </div>
    </Form>
  )
}
