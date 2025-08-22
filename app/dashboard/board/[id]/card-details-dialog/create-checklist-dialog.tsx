"use client"

import { useForm } from "react-hook-form"
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
import { createChecklist } from "./create-checklist.action"
import { useEffect } from "react"

const createChecklistSchema = z.object({
  cardId: z.uuid(),
  entityId: z.uuidv4(),
  id: z.uuid(),
  name: z.string().min(1, "Name is required")
})

export type CreateChecklistSchema = z.infer<typeof createChecklistSchema>

export function CreateChecklistDialog({
  cardId,
  open,
  onOpenChange,
  onSuccess
}: {
  cardId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (checklist: CreateChecklistSchema) => void
}) {
  const form = useForm<CreateChecklistSchema>({
    defaultValues: {
      cardId,
      entityId: uuidv4(),
      id: uuidv4(),
      name: ""
    }
  })

  useEffect(() => {
    form.setValue("cardId", cardId)
  }, [cardId])

  const onSubmit = (values: CreateChecklistSchema) => {
    // persist to db
    createChecklist(values)

    onSuccess(values)

    handleOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    form.reset({
      cardId,
      entityId: uuidv4(),
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
            Create Checklist
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
            <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="ml-auto" type="submit" disabled={!form.formState.isDirty}>
              Create Checklist
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}