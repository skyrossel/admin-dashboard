import { format } from 'date-fns'
import { db } from '@/lib/db'
import { formatter } from '@/lib/utils'
import Container from '@/components/ui/container'
import { ProductColumn } from './components/column'
import ProductClient from './components/client'

export default async function ProductsPage({
  params,
}: {
  params: { storeId: string }
}) {
  const products = await db.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category.name,
    quantity: item.quantity,
    price: formatter.format(item.price),
    archived: item.isArchived,
    featured: item.isFeatured,
    date: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <Container>
      <div className="flex flex-col gap-y-4 py-4 md:gap-y-6 md:py-8">
        <ProductClient data={formattedProducts} />
      </div>
    </Container>
  )
}
