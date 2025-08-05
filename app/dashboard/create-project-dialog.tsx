"use client"

import { useState } from "react"
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
  FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { createProject } from "./create-project.action"

const createProjectSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "name is required")
})

export type CreateProjectSchema = z.infer<typeof createProjectSchema>

export function CreateProjectDialog({
  open,
  onOpenChange,
  onSuccess
}: {  
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (project: CreateProjectSchema) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      id: uuidv4(),
      name: ""
    }
  })

  const handleOpenChange = (open: boolean) => {
    form.reset({
      id: uuidv4(),
      name: ""
    })
    onOpenChange(open)
  }

  const onSubmit = async (values: CreateProjectSchema) => {
    setIsSubmitting(true)

    await createProject(values)
      .then(() => {
        toast.success("Success", {
          description: `Project "${values.name}" has been created successfully`
        })
        onSuccess(values)
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
            Create Project
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
                </FormItem>
              )}
            />
            <Button 
              className="ml-auto" 
              disabled={!form.formState.isDirty || isSubmitting}
            >
              Create Project
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}