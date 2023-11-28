'use client'

import { redirect, useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader, Trash } from 'lucide-react'
import axios from 'axios'
import { z } from 'zod'
import { Category, Color, Image, Product, Size } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import AlertModal from '@/components/ui/alert-modal'
import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from '@/components/ui/checkbox'
import ImageUploader from '@/components/ui/image-uploader'

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[]
      })
    | null
  categories: Category[]
  sizes: Size[]
  colors: Color[]
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'The product name must contain at least one letter.',
    })
    .trim(),
  categoryId: z
    .string()
    .min(1, { message: 'In this field you must select a category.' })
    .trim(),
  quantity: z.coerce.number().min(1, {
    message: 'Quantity must be greater than or equal to 1.',
  }),
  price: z.coerce.number().min(1, {
    message: 'Price must be greater than or equal to 1.',
  }),
  sizes: z
    .array(
      z.object({
        id: z.string(),
      }),
    )
    .refine((value) => value.some((item) => item), {
      message: 'In this field you must select at least one size.',
    }),
  colors: z
    .array(
      z.object({
        id: z.string(),
      }),
    )
    .refine((value) => value.some((item) => item), {
      message: 'In this field you must select at least one color.',
    }),
  images: z
    .object({ url: z.string() })
    .array()
    .refine((value) => value.some((item) => item), {
      message: 'In this field you must select at least one image.',
    }),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
})

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  colors,
}) => {
  const params = useParams()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      categoryId: '',
      quantity: 0,
      price: 0,
      sizes: [],
      colors: [],
      images: [],
      isArchived: false,
      isFeatured: false,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      if (!initialData) {
        await axios.post(`/api/${params.storeId}/products`, values)
      } else {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          values,
        )
      }

      toast({
        title: 'Success:',
        description: `You have successfully ${
          initialData ? 'updated' : 'created'
        } the product.`,
      })
      form.reset()
      setTimeout(() => {
        router.replace(`/${params.storeId}/products`)
        router.refresh()
      }, 500)
    } catch (error: any) {
      if (error.message === 'Request failed with status code 409') {
        toast({
          variant: 'destructive',
          title: 'Error:',
          description:
            'This product already exists, please remake it for another one.',
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

      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)

      toast({
        title: 'Success:',
        description: 'You have successfully deleted the product.',
      })
      setTimeout(() => {
        router.replace(`/${params.storeId}/products`)
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
          description: 'Something went wrong...',
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
          title={initialData ? 'Edit product' : 'Create a product'}
          description={
            initialData ? 'Make changes to your product.' : 'Add a new product.'
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
                    <FormLabel>Name of your product:</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category:</FormLabel>
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
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.length ? (
                          <>
                            {categories.map((item, index) => (
                              <SelectGroup key={index}>
                                <SelectItem value={item.id}>
                                  {item.name}
                                </SelectItem>
                              </SelectGroup>
                            ))}
                          </>
                        ) : (
                          <SelectItem disabled value="nothing">
                            First of all, create a category.
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity of your product:</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price of your product:</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isArchived"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-x-4 rounded-md border px-4 py-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex flex-col gap-y-1">
                      <FormLabel>Archived</FormLabel>
                      <FormDescription>
                        This product will not appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-x-4 rounded-md border px-4 py-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex flex-col gap-y-1">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This product will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sizes"
                render={() => (
                  <FormItem>
                    <FormLabel>Sizes:</FormLabel>
                    <FormDescription>
                      Select the sizes you want to display in your store for
                      this product.
                    </FormDescription>
                    {sizes.map((item, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name="sizes"
                        render={({ field }) => (
                          <FormItem className="flex w-full items-center justify-between">
                            <FormLabel>{item.value}</FormLabel>
                            <FormControl>
                              <Checkbox
                                checked={field.value?.some(
                                  (value) => value.id === item.id,
                                )}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        {
                                          id: item.id,
                                        },
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value.id !== item.id,
                                        ),
                                      )
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colors"
                render={() => (
                  <FormItem>
                    <FormLabel>Colors:</FormLabel>
                    <FormDescription>
                      Select the colors you want to display in your store for
                      this product.
                    </FormDescription>
                    {colors.map((item, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name="colors"
                        render={({ field }) => (
                          <FormItem className="flex w-full items-center justify-between">
                            <FormLabel>{item.name}</FormLabel>
                            <FormControl>
                              <Checkbox
                                checked={field.value?.some(
                                  (value) => value.id === item.id,
                                )}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        {
                                          id: item.id,
                                        },
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value.id !== item.id,
                                        ),
                                      )
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Images of your product:</FormLabel>
                    <FormControl>
                      <ImageUploader
                        disabled={isLoading}
                        onChange={(url) =>
                          field.onChange([...field.value, { url }])
                        }
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url,
                            ),
                          ])
                        }
                        value={field.value.map((image) => image.url)}
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

export default ProductForm
