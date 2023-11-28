import { format } from 'date-fns'
import { db } from '@/lib/db'
import Container from '@/components/ui/container'
import { CategoryColumn } from './components/column'
import CategoryClient from './components/client'

export default async function CategoriesPage({
  params,
}: {
  params: { storeId: string }
}) {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboard: item.billboard.label,
    date: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <Container>
      <div className="flex flex-col gap-y-4 py-4 md:gap-y-6 md:py-8">
        <CategoryClient data={formattedCategories} />
      </div>
    </Container>
  )
}
