import { db } from '@/lib/db'
import Container from '@/components/ui/container'
import SizeForm from './components/size-form'

export default async function SizePage({
  params,
}: {
  params: { sizeId: string }
}) {
  const size = await db.size.findUnique({
    where: {
      id: params.sizeId,
    },
  })

  return (
    <Container>
      <div className="flex flex-col gap-y-4 py-4 md:gap-y-6 md:py-8">
        <SizeForm initialData={size} />
      </div>
    </Container>
  )
}
