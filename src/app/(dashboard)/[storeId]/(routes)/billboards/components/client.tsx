'use client'

import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { BillboardColumn, columns } from './column'

interface BillboardClientProps {
  data: BillboardColumn[]
}

const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const params = useParams()
  const router = useRouter()

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-y-2">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage and create billboards for your store."
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
          className="h-8 rounded-md px-3 text-xs sm:h-9 sm:px-4 sm:py-2 sm:text-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} filterKey="label" />
    </>
  )
}

export default BillboardClient
