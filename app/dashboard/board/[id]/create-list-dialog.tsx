"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import * as z from "zod/v4"

import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { createList } from "./create-list.action"

const createListSchema = z.object({
  boardId: z.uuid(),
  orderNumber: z.number(),
  id: z.uuid(),
  name: z.string().min(1, "Name is requried")
})

export type CreateListSchema = z.infer<typeof createListSchema>

export function CreateListDialog({
  open,
  onOpenChange,
  onSuccess,
  boardId,
  orderNumber
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (list: CreateListSchema) => void
  boardId: string
  orderNumber: number
}) {
  const form = useForm<CreateListSchema>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      boardId: boardId,
      orderNumber: orderNumber,
      id: uuidv4(),
      name: ""
    }
  })

  useEffect(() => {
    form.reset({
      boardId: boardId,
      orderNumber: orderNumber,
      id: uuidv4(),
      name: ""
    })
  }, [boardId, orderNumber])

  const onSubmit = (values: CreateListSchema) => {
    createList(values)
    form.reset({
      boardId: boardId,
      orderNumber: orderNumber,
      id: uuidv4(),
      name: ""
    })
    toast.success(`Added "${values.name}" list`)
    onSuccess(values)
  }

  const handleOpenChange = (open: boolean) => {
    form.reset({
      boardId: boardId,
      orderNumber: orderNumber,
      id: uuidv4(),
      name: ""
    })

    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create List
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="ml-auto" disabled={!form.formState.isDirty} type="submit">
              Create List
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}