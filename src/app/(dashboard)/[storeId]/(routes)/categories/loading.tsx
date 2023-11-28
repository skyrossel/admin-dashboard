import { Loader } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-6.575rem)] w-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  )
}
