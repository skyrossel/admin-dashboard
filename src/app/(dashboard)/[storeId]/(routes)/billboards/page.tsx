import { format } from 'date-fns'
import { db } from '@/lib/db'
import Container from '@/components/ui/container'
import { BillboardColumn } from './components/column' 
import BillboardClient from './components/client'

export default async function BillboardsPage({
  params,
}: {
  params: { storeId: string }
}) {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    date: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <Container>
      <div className="flex flex-col gap-y-4 md:gap-y-6 py-4 md:py-8">
        <BillboardClient data={formattedBillboards} />
      </div>
    </Container>
  )
}
