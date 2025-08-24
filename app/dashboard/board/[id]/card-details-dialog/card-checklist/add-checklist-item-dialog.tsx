"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
import { useEffect } from "react"
import { addChecklistItem } from "./add-checklist-item.action"

const createChecklistItemSchema = z.object({
  checklistId: z.uuid(),
  checklistItemId: z.uuid(),
  checklistItemName: z.string().min(1, "Name is required"),
  checklistItemOrderNumber: z.number()
})

export type CreateChecklistItemSchema = z.infer<typeof createChecklistItemSchema>

export function AddChecklistItemDialog({
  checklistId,
  checklistItemOrderNumber,
  open,
  onOpenChange,
  onSuccess
}: {
  checklistId: string
  checklistItemOrderNumber: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (checklistItem: CreateChecklistItemSchema) => void
}) {
  const form = useForm<CreateChecklistItemSchema>({
    resolver: zodResolver(createChecklistItemSchema),
    defaultValues: {
      checklistId: checklistId,
      checklistItemId: uuidv4(),
      checklistItemName: "",
      checklistItemOrderNumber: checklistItemOrderNumber
    }
  })

  useEffect(() => {
    form.reset({
      checklistId: checklistId,
      checklistItemId: uuidv4(),
      checklistItemName: "",
      checklistItemOrderNumber: checklistItemOrderNumber
    })
  }, [checklistId])

  const onSubmit = (values: CreateChecklistItemSchema) => {
    // persist to db
    addChecklistItem(values)
  
    onSuccess(values)
    handleOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    form.reset({
      checklistId: checklistId,
      checklistItemId: uuidv4(),
      checklistItemName: "",
      checklistItemOrderNumber: checklistItemOrderNumber
    })
    onOpenChange(open)
  }

  console.log(form.formState.errors)
  console.log(form.watch("checklistId"))

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Checklist Item
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
              control={form.control}
              name="checklistItemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              className="ml-auto"
              type="submit"
            >
              Add Item
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}