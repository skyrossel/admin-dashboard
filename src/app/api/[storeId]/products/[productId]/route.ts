import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        category: true,
        sizes: true,
        colors: true,
        images: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
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
      return new NextResponse('Unauthorized', { status: 405 })
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

    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        categoryId,
        quantity,
        isArchived,
        isFeatured,
        price,
        sizes: {
          disconnect: sizes.map((size: {}) => size),
        },
        colors: {
          disconnect: colors.map((color: {}) => color),
        },
        images: {
          deleteMany: {},
        },
      },
    })

    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
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
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const product = await db.product.delete({
      where: {
        id: params.productId,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}
