'use client'

import { redirect, useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader, Trash } from 'lucide-react'
import axios from 'axios'
import { z } from 'zod'
import { Color } from '@prisma/client'
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

interface ColorFormProps {
  initialData: Color | null
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'The color name must contain at least one letter.',
    })
    .trim(),
  value: z
    .string()
    .min(4, {
      message: 'The color name must contain at least four letters.',
    })
    .max(9, {
      message: 'The color value must not be nine letters long.',
    })
    .regex(/^#/, {
      message: 'The color value must be a valid hex code.',
    })
    .trim(),
})

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      if (!initialData) {
        await axios.post(`/api/${params.storeId}/colors`, values)
      } else {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          values,
        )
      }

      toast({
        title: 'Success:',
        description: `You have successfully ${
          initialData ? 'updated' : 'created'
        } the color.`,
      })
      form.reset()
      setTimeout(() => {
        router.replace(`/${params.storeId}/colors`)
        router.refresh()
      }, 500)
    } catch (error: any) {
      if (error.message === 'Request failed with status code 409') {
        toast({
          variant: 'destructive',
          title: 'Error:',
          description:
            'A name and value for this color already exists, rename it to a different name or value.',
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
          description: 'Something  went wrong...',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onConfirm = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)

      toast({
        title: 'Success:',
        description: 'You have successfully deleted the color.',
      })
      setTimeout(() => {
        router.replace(`/${params.storeId}/colors`)
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
          description: 'First of all, make sure you remove dependent products.',
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
          title={initialData ? 'Edit color' : 'Create a color'}
          description={
            initialData ? 'Make changes to your color.' : 'Add a new color.'
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of your color:</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value of your color:</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-x-2">
                        <Input disabled={isLoading} {...field} />
                        <div
                          className="rounded-full border p-4"
                          style={{ backgroundColor: field.value }}
                        />
                      </div>
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

export default ColorForm
