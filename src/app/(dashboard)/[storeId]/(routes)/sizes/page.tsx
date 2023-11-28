import { format } from 'date-fns'
import { db } from '@/lib/db'
import Container from '@/components/ui/container'
import { SizeColumn } from './components/column'
import SizeClient from './components/client'

export default async function SizesPage({
  params,
}: {
  params: { storeId: string }
}) {
  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    date: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <Container>
      <div className="flex flex-col gap-y-4 py-4 md:gap-y-6 md:py-8">
        <SizeClient data={formattedSizes} />
      </div>
    </Container>
  )
}
