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

import { createCard } from "./create-card.action"

const createCardSchema = z.object({
  listId: z.uuid(),
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  orderNumber: z.number()
})

export type CreateCardSchema = z.infer<typeof createCardSchema>

export function CreateCardDialog({
  open,
  onClose,
  onSuccess,
  listId,
  orderNumber
}: {
  open: boolean
  onClose: () => void
  onSuccess: (card: CreateCardSchema) => void
  listId: string
  orderNumber: number
}) {
  const form = useForm<CreateCardSchema>({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      listId: listId,
      id: uuidv4(),
      name: "",
      description: "",
      orderNumber: orderNumber
    }
  })

  useEffect(() => {
    form.reset({
      listId: listId,
      id: uuidv4(),
      name: "",
      description: "",
      orderNumber: orderNumber
    })
  }, [listId, orderNumber])

  const onSubmit = (values: CreateCardSchema) => {
    createCard(values)
    form.reset({
      listId: listId,
      id: uuidv4(),
      name: "",
      description: "",
      orderNumber: orderNumber
    })
    onClose()
    toast.success(`Added "${values.name}" card`)
    onSuccess(values)
  }

  const handleOpenChange = (open: boolean) => {
    form.reset({
      listId: listId,
      id: uuidv4(),
      name: "",
      description: "",
      orderNumber: orderNumber
    })

    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Card
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
              Create Card
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}