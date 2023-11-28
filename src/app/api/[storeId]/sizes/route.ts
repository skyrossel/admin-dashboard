import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } },
) {
  try {
    const body = await req.json()
    const { name, value } = body

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

    const exist = await db.size.findFirst({
      where: {
        name,
        value,
      },
    })

    if (exist) {
      return new NextResponse('Conflict', { status: 409 })
    }

    const size = await db.size.create({
      data: {
        storeId: params.storeId,
        name,
        value,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { storeId: string } },
) {
  try {
    const sizes = await db.size.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(sizes)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}
