'use client'

import { useEffect } from 'react'
import useStoreModal from '@/hooks/use-store-modal'

export default function SetUpPage() {
  const isOpen = useStoreModal((state) => state.isOpen)
  const onOpen = useStoreModal((state) => state.onOpen)

  useEffect(() => {
    if (!isOpen) {
      onOpen()
    }
  }, [isOpen, onOpen])

  return null
}
