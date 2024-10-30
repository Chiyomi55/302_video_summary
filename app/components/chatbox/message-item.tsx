import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Message } from './types'
import { formatTimestamp } from './util'

export const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  const { sender, content, timestamp } = message
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <div
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`flex max-w-[80%] items-start space-x-2 ${
          sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
        }`}
      >
        <Avatar className='h-8 w-8'>
          <AvatarImage
            src={sender === 'user' ? '/images/user-avatar.png' : '/images/ai-avatar.png'}
            alt={sender === 'user' ? 'User' : 'AI'}
          />
          <AvatarFallback>{sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
        </Avatar>
        <div className={`group relative rounded-lg bg-muted p-3`}>
          <ReactMarkdown
            className={`prose max-w-none text-sm dark:prose-invert`}
          >
            {content}
          </ReactMarkdown>
          <div className={`mt-1 text-xs text-muted-foreground`}>
            {formatTimestamp(timestamp)}
          </div>
          <Button
            variant='icon'
            size='roundIconMd'
            className='absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 bg-background/80 hover:bg-background'
            onClick={handleCopy}
          >
            {isCopied ? (
              <Check className='h-4 w-4' />
            ) : (
              <Copy className='h-4 w-4' />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
