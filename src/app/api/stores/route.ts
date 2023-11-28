import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name } = body

    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const exist = await db.store.findFirst({
      where: {
        name,
      },
    })

    if (exist) {
      return new NextResponse('Conflict', { status: 409 })
    }

    const store = await db.store.create({
      data: {
        userId,
        name,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}
