import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } },
) {
  try {
    const body = await req.json()
    const { label, imageUrl } = body

    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const exist = await db.billboard.findFirst({
      where: {
        label,
        imageUrl,
      },
    })

    if (exist) {
      return new NextResponse('Conflict', { status: 409 })
    }

    const billboard = await db.billboard.create({
      data: {
        storeId: params.storeId,
        label,
        imageUrl,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { storeId: string } },
) {
  try {
    const billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(billboards)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}
