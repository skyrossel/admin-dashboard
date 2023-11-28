import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const body = await req.json()
    const {
      name,
      categoryId,
      quantity,
      price,
      isArchived,
      isFeatured,
      sizes,
      colors,
      images,
    } = body

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

    const exist = await db.product.findFirst({
      where: {
        name,
        categoryId,
        quantity,
        price,
        isArchived,
        isFeatured,
        sizes: {
          none: {},
        },
        colors: {
          none: {},
        },
        images: {
          none: {},
        },
      },
    })

    if (exist) {
      return new NextResponse('Conflict', { status: 409 })
    }

    const product = await db.product.create({
      data: {
        storeId: params.storeId,
        name,
        categoryId,
        quantity,
        price,
        isArchived,
        isFeatured,
        sizes: {
          connect: sizes.map((size: {}) => size),
        },
        colors: {
          connect: colors.map((color: {}) => color),
        },
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined
    const billboardId = searchParams.get('billboardId') || undefined
    const sizeId = searchParams.getAll('sizeId') || undefined
    const colorId = searchParams.getAll('colorId') || undefined
    const isFeatured = searchParams.get('isFeatured') || undefined

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        category: {
          billboardId,
        },
        sizes: sizeId.length > 0 ? { some: { id: { in: sizeId } } } : undefined,
        colors:
          colorId.length > 0 ? { some: { id: { in: colorId } } } : undefined,
        isArchived: false,
        isFeatured: isFeatured ? true : undefined,
      },
      include: {
        category: true,
        sizes: true,
        colors: true,
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}
