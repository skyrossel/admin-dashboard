import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import Container from '@/components/ui/container'
import SettingsForm from './components/settings-form'

export default async function SettingsPage({
  params,
}: {
  params: { storeId: string }
}) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  })

  if (!store) {
    redirect('/')
  }

  return (
    <Container>
      <div className="flex flex-col gap-y-6 py-4 md:py-8">
        <SettingsForm initialData={store} />
      </div>
    </Container>
  )
}
