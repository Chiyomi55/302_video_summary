'use client'
import { Subtitle } from '@/app/stores/use-video-info-store'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import DOMPurify from 'dompurify'

export interface SubtitleItemProps {
  subtitle: Subtitle
  onClick?: (startTime: number) => void
  searchText?: string
  className?: string
}

export default function SubtitleItem({
  subtitle,
  onClick,
  searchText = '',
  className,
}: SubtitleItemProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const highlightContent = (content: string, searchText: string) => {
    if (!searchText) return content
    const regex = new RegExp(`(${searchText})`, 'gi')

    return content.replace(regex, '<mark>$1</mark>')
  }

  const sanitizedContent = DOMPurify.sanitize(
    highlightContent(subtitle.text, searchText)
  )

  return (
    <Card
      className={cn(
        'cursor-pointer rounded-md shadow-none hover:border-primary',
        className
      )}
    >
      <CardContent
        className='hover:border-primary-400 overflow-hidden p-2'
        onClick={() => onClick?.(subtitle.startTime)}
      >
        <div className='text-sm'>
          <span className='mr-2 text-sky-400'>
            {formatTime(subtitle.startTime)}
          </span>
          <span
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            className=''
          />
        </div>
      </CardContent>
    </Card>
  )
}
