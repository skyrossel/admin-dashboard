'use client'

import { redirect, useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader, Trash } from 'lucide-react'
import axios from 'axios'
import { z } from 'zod'
import { Billboard, Category } from '@prisma/client'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CategoryFormProps {
  initialData: Category | null
  billboards: Billboard[]
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'The category name must contain at least one letter.',
    })
    .trim(),
  billboardId: z
    .string()
    .min(1, { message: 'In this field you must select a billboard.' })
    .trim(),
})

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      if (!initialData) {
        await axios.post(`/api/${params.storeId}/categories`, values)
      } else {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          values,
        )
      }

      toast({
        title: 'Success:',
        description: `You have successfully ${
          initialData ? 'updated' : 'created'
        } the category.`,
      })
      form.reset()
      setTimeout(() => {
        router.replace(`/${params.storeId}/categories`)
        router.refresh()
      }, 500)
    } catch (error: any) {
      if (error.message === 'Request failed with status code 409') {
        toast({
          variant: 'destructive',
          title: 'Error:',
          description:
            'A name and billboard for this category already exists, rename it to a different name or billboard.',
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

      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`,
      )

      toast({
        title: 'Success:',
        description: 'You have successfully deleted the category.',
      })
      setTimeout(() => {
        router.replace(`/${params.storeId}/categories`)
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
          title={initialData ? 'Edit category' : 'Create a category'}
          description={
            initialData
              ? 'Make changes to your category.'
              : 'Add a new category.'
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
                    <FormLabel>Name of your category:</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billboardId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billboard:</FormLabel>
                    <Select
                      disabled={isLoading}
                      defaultValue={field.value}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a billboard"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.length ? (
                          <>
                            {billboards.map((item, index) => (
                              <SelectGroup key={index}>
                                <SelectItem value={item.id}>
                                  {item.label}
                                </SelectItem>
                              </SelectGroup>
                            ))}
                          </>
                        ) : (
                          <SelectItem disabled value="nothing">
                            First of all, create a billboard.
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
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

export default CategoryForm
