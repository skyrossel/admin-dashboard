import { format } from 'date-fns'
import { db } from '@/lib/db'
import Container from '@/components/ui/container'
import { ColorColumn } from './components/column'
import ColorClient from './components/client'

export default async function ColorsPage({
  params,
}: {
  params: { storeId: string }
}) {
  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    date: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <Container>
      <div className="flex flex-col gap-y-4 py-4 md:gap-y-6 md:py-8">
        <ColorClient data={formattedColors} />
      </div>
    </Container>
  )
}
