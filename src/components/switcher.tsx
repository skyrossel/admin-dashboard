'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from 'lucide-react'
import { Store } from '@prisma/client'
import useStoreModal from '@/hooks/use-store-modal'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface SwitcherProps extends PopoverTriggerProps {
  stores: Store[]
}

const Switcher: React.FC<SwitcherProps> = ({ stores }) => {
  const params = useParams()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  const storeModal = useStoreModal()

  const currentStore = stores.find((store) => store.id === params.storeId)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-48"
          title={currentStore?.name}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.name}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search a store" />
            <CommandGroup heading={stores.length >= 1 ? 'Store:' : 'Stores:'}>
              {stores.map((store, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    setIsOpen(false)
                    router.push(`/${store.id}`)
                  }}
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.name}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      store.id === currentStore?.id
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandEmpty>No results.</CommandEmpty>
          </CommandList>
          <Separator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setIsOpen(false)
                  storeModal.onOpen()
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a new store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Switcher
