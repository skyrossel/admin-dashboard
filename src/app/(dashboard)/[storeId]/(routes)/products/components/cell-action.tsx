'use client'

import { redirect, useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
import AlertModal from '@/components/ui/alert-modal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ProductColumn } from './column'

interface CellActionProps {
  data: ProductColumn
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const params = useParams()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onClick = (id: string) => {
    navigator.clipboard.writeText(id)
    toast({
      title: 'Success:',
      description:
        'You have successfully copied the Product ID to your clipboard.',
    })
  }

  const onConfirm = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/${params.storeId}/products/${data.id}`)

      toast({
        title: 'Success:',
        description: 'You have successfully deleted the product.',
      })
      setTimeout(() => {
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions:</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/products/${data.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Make changes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onClick(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CellAction
