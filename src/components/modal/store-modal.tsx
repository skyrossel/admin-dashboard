'use client'

import { redirect } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader } from 'lucide-react'
import axios from 'axios'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useStoreModal from '@/hooks/use-store-modal'
import { toast } from '@/hooks/use-toast'
import Modal from '@/components/ui/modal'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'The store name must contain at least one letter.' })
    .trim(),
})

const StoreModal = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { isOpen, onClose } = useStoreModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      const response = await axios.post('/api/stores', values)

      toast({
        title: 'Success:',
        description: 'You have successfully created a store.',
      })
      onClose()
      setTimeout(() => {
        window.location.assign(`/${response.data.id}`)
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
        onClose()
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a store"
      description="Add a new store to manage the store."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of your store:</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col-reverse items-center gap-2 sm:flex-row sm:justify-end">
              <Button
                disabled={isLoading}
                onClick={() => onClose()}
                type="button"
                variant="outline"
                className="w-full sm:w-fit"
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full sm:w-24"
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <span>Continue</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  )
}

export default StoreModal
