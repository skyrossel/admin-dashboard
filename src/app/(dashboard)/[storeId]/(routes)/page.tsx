import { db } from '@/lib/db'
import Container from '@/components/ui/container'
import Heading from '@/components/ui/heading'

export default async function DashboardPage({
  params,
}: {
  params: { storeId: string }
}) {
  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
    },
  })

  return (
    <Container>
      <div className="flex flex-col gap-y-6 py-4 md:py-8">
        <Heading title="Dashboard" description="Overview of your store." />
      </div>
    </Container>
  )
}
