'use client'

import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'
import { useEffect, useState } from 'react'
import { ImagePlus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  disabled: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-4">
        {value.map((url, index) => (
          <div
            key={index}
            className="relative h-48 w-48 overflow-hidden rounded-md"
          >
            <div className="absolute right-2 top-2 z-10">
              <Button
                onClick={() => onRemove(url)}
                type="button"
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt={String(index + 1)}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="usfu8chv">
        {({ open }) => {
          const onClick = () => {
            open()
          }

          return (
            <Button
              disabled={disabled}
              onClick={onClick}
              type="button"
              variant="secondary"
              className="w-fit"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUploader
