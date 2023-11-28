'use client'

import { redirect, useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader, Trash } from 'lucide-react'
import axios from 'axios'
import { z } from 'zod'
import { Billboard } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import AlertModal from '@/components/ui/alert-modal'
import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ImageUploader from '@/components/ui/image-uploader'

interface BillboardFormProps {
  initialData: Billboard | null
}

const formSchema = z.object({
  label: z
    .string()
    .min(1, {
      message: 'The billboard label must contain at least one letter.',
    })
    .trim(),
  imageUrl: z
    .string()
    .min(1, { message: 'Image fields must be filled in.' })
    .trim(),
})

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      if (!initialData) {
        await axios.post(`/api/${params.storeId}/billboards`, values)
      } else {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          values,
        )
      }

      toast({
        title: 'Success:',
        description: `You have successfully ${
          initialData ? 'updated' : 'created'
        } the billboard.`,
      })
      form.reset()
      setTimeout(() => {
        router.replace(`/${params.storeId}/billboards`)
        router.refresh()
      }, 500)
    } catch (error: any) {
      if (error.message === 'Request failed with status code 409') {
        toast({
          variant: 'destructive',
          title: 'Error:',
          description:
            'A label for this billboard already exists, rename it to a different label.',
        })
      } else if (error.message === 'Request failed with status code 401') {
        toast({
          variant: 'destructive',
          title: 'Error:',
          description:
            'First of all, you need to be logged in to perform this action.',
        })
        setTimeout(() => {
          redirect('/sign-in')
        }, 500)
      } else {
        toast({
          variant: 'destructive',
          title: 'Error:',
          description: 'Something went wrong...',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onConfirm = async () => {
    try {
      setIsLoading(true)

      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`,
      )

      toast({
        title: 'Success:',
        description: 'You have successfully deleted the billboard.',
      })
      setTimeout(() => {
        router.replace(`/${params.storeId}/billboards`)
        router.refresh()
      }, 500)
    } catch (error: any) {
      if (error.message === 'Request failed with status code 401') {
        toast({
          variant: 'destructive',
          title: 'Error:',
          description:
            'First of all, you need to be logged in to perform this action.',
        })
        setTimeout(() => {
          redirect('/sign-in')
        }, 500)
      } else {
        toast({
          variant: 'destructive',
          title: 'Error:',
          description:
            'First of all, make sure you remove dependent categories and products.',
        })
      }
    } finally {
      setIsOpen(false)
      setIsLoading(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={onConfirm}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={initialData ? 'Edit billboard' : 'Create a billboard'}
          description={
            initialData
              ? 'Make changes to your billboard.'
              : 'Add a new billboard.'
          }
        />
        {initialData ? (
          <Button
            onClick={() => setIsOpen(true)}
            variant="destructive"
            size="icon"
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your label on a billboard:</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background image for your billboard:</FormLabel>
                    <FormControl>
                      <ImageUploader
                        disabled={isLoading}
                        onChange={(url) => field.onChange(url)}
                        onRemove={() => field.onChange('')}
                        value={field.value ? [field.value] : []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col-reverse items-center gap-2 sm:flex-row sm:justify-end">
              <Button
                disabled={isLoading}
                onClick={() => router.back()}
                type="button"
                variant="outline"
                className="w-full sm:w-fit "
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full sm:w-32"
              >
                {initialData ? (
                  <span>Save Changes</span>
                ) : isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <span>Create</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

export default BillboardForm
