import { Server } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface AlertApiProps {
  variant: 'public'
  title: string
  description: string
}

const AlertApi: React.FC<AlertApiProps> = ({ variant, title, description }) => {
  const onClick = () => {
    navigator.clipboard.writeText(description)
    toast({
      title: 'Success:',
      description:
        'You have successfully copied the API route to your clipboard.',
    })
  }

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2 p-1">
          <AlertTitle>{title}</AlertTitle>
          <Badge>{variant}</Badge>
        </div>
        <AlertDescription onClick={onClick}>
          <code className="rounded bg-muted p-1 font-semibold">
            {description}
          </code>
        </AlertDescription>
      </div>
    </Alert>
  )
}

export default AlertApi
