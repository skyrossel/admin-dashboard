import '@/styles/clerk.css'

import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import Header from '@/components/header'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: { storeId: string }
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

  const stores = await db.store.findMany({
    where: {
      userId,
    },
  })

  return (
    <>
      <Header stores={stores} />
      {children}
    </>
  )
}
