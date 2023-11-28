import { db } from '@/lib/db'
import Container from '@/components/ui/container'
import ProductForm from './components/product-form'

export default async function ProductPage({
  params,
}: {
  params: { storeId: string; productId: string }
}) {
  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      sizes: true,
      colors: true,
      images: true,
    },
  })

  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <Container>
      <div className="flex flex-col gap-y-4 py-4 md:gap-y-6 md:py-8">
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </Container>
  )
}
