import { db } from '@/lib/db'
import Container from '@/components/ui/container'
import ColorForm from './components/color-form'

export default async function ColorPage({
  params,
}: {
  params: { colorId: string }
}) {
  const color = await db.color.findUnique({
    where: {
      id: params.colorId,
    },
  })

  return (
    <Container>
      <div className="flex flex-col gap-y-4 py-4 md:gap-y-6 md:py-8">
        <ColorForm initialData={color} />
      </div>
    </Container>
  )
}
