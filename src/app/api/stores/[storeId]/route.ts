import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { storeId: string } },
) {
  try {
    const body = await req.json()
    const { name } = body

    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const exist = await db.store.findFirst({
      where: {
        name,
      },
    })

    if (exist) {
      return new NextResponse('Conflict', { status: 409 })
    }

    const store = await db.store.update({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const store = await db.store.delete({
      where: {
        id: params.storeId,
        userId,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}
