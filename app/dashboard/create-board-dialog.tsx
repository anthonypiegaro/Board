"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
  FormLabel,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { createBoard } from "./create-board.action"

const createBoardSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  name: z.string().min(1, "Name is required")
})

export type CreateBoardSchema = z.infer<typeof createBoardSchema>

export function CreateBoardDialog({
  open,
  onOpenChange,
  projectId
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const form = useForm<CreateBoardSchema>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      id: uuidv4(),
      projectId: projectId,
      name: ""
    }
  })

  useEffect(() => {
    form.setValue("projectId", projectId)
  }, [projectId])

  const handleOpenChange = (open: boolean) => {
    form.reset({
      id: uuidv4(),
      name: "",
      projectId: ""
    })

    onOpenChange(open)
  }

  const onSubmit = async (values: CreateBoardSchema) => {
    setIsSubmitting(true)

    await createBoard(values)
      .then(() => {
        toast.success("Suucess", {
          description: `Board "${values.name}" has been created successfully`
        })
        router.push(`/dashboard/board/${values.id}`)
        handleOpenChange(false)
      })
      .catch(e => {
        toast.error("Error", {
          description: e.message
        })
      })

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Board
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
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="ml-auto" disabled={!form.formState.isDirty || isSubmitting}>
              {isSubmitting ? "Creating board..." : "Create Board"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}