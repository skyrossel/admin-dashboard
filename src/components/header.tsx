import { UserButton } from '@clerk/nextjs'
import { Store } from '@prisma/client'
import Container from '@/components/ui/container'
import { ModeToggle } from '@/components/mode-toggle'
import Navbar from '@/components/navbar'
import Switcher from '@/components/switcher'

interface HeaderProps {
  stores: Store[]
}

const Header: React.FC<HeaderProps> = ({ stores }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex items-center py-4">
          <Switcher stores={stores} />
          <div className="ml-auto flex items-center gap-x-2">
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
        <Navbar />
      </Container>
    </header>
  )
}

export default Header
