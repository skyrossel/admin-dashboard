'use client'

import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { CategoryColumn, columns } from './column'

interface CategoryClientProps {
  data: CategoryColumn[]
}

const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const params = useParams()
  const router = useRouter()

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-y-2">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage and create categories for your store."
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
          className="h-8 rounded-md px-3 text-xs sm:h-9 sm:px-4 sm:py-2 sm:text-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} filterKey="name" />
    </>
  )
}

export default CategoryClient
