'use client'

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { buttonVariants } from '@/components/ui/button'

const Navbar = () => {
  const params = useParams()
  const pathname = usePathname()

  const routes = [
    {
      active: pathname === `/${params.storeId}`,
      href: `/${params.storeId}`,
      name: 'Overview',
    },
    {
      active:
        pathname === `/${params.storeId}/billboards` ||
        pathname === `/${params.storeId}/billboards/${params.billboardId}`,
      href: `/${params.storeId}/billboards`,
      name: 'Billboards',
    },
    {
      active:
        pathname === `/${params.storeId}/categories` ||
        pathname === `/${params.storeId}/categories/${params.categoryId}`,
      href: `/${params.storeId}/categories`,
      name: 'Categories',
    },
    {
      active:
        pathname === `/${params.storeId}/sizes` ||
        pathname === `/${params.storeId}/sizes/${params.sizeId}`,
      href: `/${params.storeId}/sizes`,
      name: 'Sizes',
    },
    {
      active:
        pathname === `/${params.storeId}/colors` ||
        pathname === `/${params.storeId}/colors/${params.colorId}`,
      href: `/${params.storeId}/colors`,
      name: 'Colors',
    },
    {
      active:
        pathname === `/${params.storeId}/products` ||
        pathname === `/${params.storeId}/products/${params.productId}`,
      href: `/${params.storeId}/products`,
      name: 'Products',
    },
    {
      active: pathname === `/${params.storeId}/settings`,
      href: `/${params.storeId}/settings`,
      name: 'Settings',
    },
  ]

  return (
    <ScrollArea>
      <nav className="flex items-center">
        {routes.map((route, index) => (
          <Link
            key={index}
            href={route.href}
            className={buttonVariants({
              variant: 'link',
              className: cn(
                'rounded-none border-b border-transparent pb-4 pt-0 transition hover:no-underline',
                route.active
                  ? 'border-zinc-700 dark:border-gray-300'
                  : 'hover:border-gray-300 dark:hover:border-zinc-700',
              ),
            })}
          >
            {route.name}
          </Link>
        ))}
      </nav>
      <ScrollBar orientation="horizontal" className="relative" />
    </ScrollArea>
  )
}

export default Navbar
