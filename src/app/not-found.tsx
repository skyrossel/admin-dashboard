'use client'

import { useRouter } from 'next/navigation'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col gap-y-4">
        <Heading
          title="Not Found"
          description="The page you're looking for was not found."
        />
        <Separator />
        <Button onClick={() => router.back()}>Back</Button>
      </div>
    </div>
  )
}
