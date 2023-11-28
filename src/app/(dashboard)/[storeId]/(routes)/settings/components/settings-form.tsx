'use client'

import { redirect, useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader, Trash } from 'lucide-react'
import axios from 'axios'
import { z } from 'zod'
import { Store } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { useOrigin } from '@/hooks/use-origin'
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
import AlertApi from '@/components/ui/alert-api'

interface SettingsFormProps {
  initialData: Store
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'The new name of your store must contain at least one letter.',
    })
    .trim(),
})

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const origin = useOrigin()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      await axios.patch(`/api/stores/${params.storeId}`, values)

      toast({
        title: 'Success:',
        description: 'You have successfully updated the store name.',
      })
      form.reset()
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error: any) {
      if (error.message === 'Request failed with status code 409') {
        toast({
          variant: 'destructive',
          title: 'Error:',
          description:
            'A name for this store already exists, rename it to a different name.',
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

      await axios.delete(`/api/stores/${params.storeId}`)

      toast({
        title: 'Success:',
        description: 'You have successfully deleted the store.',
      })
      setTimeout(() => {
        router.replace('/')
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
          description: 'First of all, make sure you remove all dependencies.',
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
          title="Settings"
          description="Change your preferences in your store."
        />
        <Button
          onClick={() => setIsOpen(true)}
          variant="destructive"
          size="icon"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New name for your store:</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
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
                className="w-full sm:w-20"
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <span>Update</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <Separator />
      <AlertApi
        variant="public"
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  )
}

export default SettingsForm
