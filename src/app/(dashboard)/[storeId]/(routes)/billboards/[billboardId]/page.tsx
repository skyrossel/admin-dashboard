import { db } from '@/lib/db'
import Container from '@/components/ui/container'
import BillboardForm from './components/billboard-form'

export default async function BillboardPage({
  params,
}: {
  params: { billboardId: string }
}) {
  const billboard = await db.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  })

  return (
    <Container>
      <div className="flex flex-col gap-y-4 py-4 md:gap-y-6 md:py-8">
        <BillboardForm initialData={billboard} />
      </div>
    </Container>
  )
}
