import { db } from '@/lib/db'
import Container from '@/components/ui/container'
import CategoryForm from './components/category-form'

export default async function CategoryPage({
  params,
}: {
  params: { storeId: string; categoryId: string }
}) {
  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
  })

  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <Container>
      <div className="flex flex-col gap-y-4 py-4 md:gap-y-6 md:py-8">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </Container>
  )
}
