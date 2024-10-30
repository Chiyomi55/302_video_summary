'use client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import { getAll, remove, save } from '@/lib/db'
import { formatDate } from 'date-fns'
import { DeleteIcon, HistoryIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useClientTranslation } from '../hooks/use-client-translation'
import { useVideoInfoStore } from '../stores/use-video-info-store'

export interface HistoryProps {
  className?: string
  disabled?: boolean
}
export function History({ className, disabled }: HistoryProps) {
  const { t } = useClientTranslation()
  const { updateVideoInfo } = useVideoInfoStore((state) => ({
    updateVideoInfo: state.updateAll,
  }))
  const router = useRouter()
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [history, setHistory] = useState<any[]>([])
  return (
    <>
      <DropdownMenu
        onOpenChange={async (open) => {
          if (open) {
            const data = await getAll()
            setHistory(data)
          }
        }}
      >
        <DropdownMenuTrigger asChild={true} disabled={disabled}>
          <Button
            aria-label='show history'
            variant='icon'
            size='roundIconLg'
            className={cn(className)}
          >
            <HistoryIcon className='' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          aria-describedby={undefined}
          className='h-72 max-w-sm overflow-y-auto'
        >
          {history.map((item) => {
            return (
              <DropdownMenuItem
                key={item.id}
                className='flex cursor-pointer items-center gap-1'
                onClick={async () => {
                  updateVideoInfo({ ...item, updatedAt: Date.now() })
                  await save(useVideoInfoStore.getState())
                  toast.success(t('home:history.restored'))
                }}
              >
                <span className='line-clamp-1 flex-1'>{item.title}</span>
                <span className='flex-shrink-0 text-gray-500'>
                  {formatDate(item.updatedAt, 'MM-dd HH:mm')}
                </span>
                <Button
                  aria-label='remove history'
                  variant='icon'
                  size='roundIconSm'
                  className='hover:text-red-500'
                  onClick={async (e) => {
                    e.stopPropagation()
                    await remove(item.id)
                    setHistory(history.filter((i) => i.id !== item.id))
                    toast.success(t('home:history.removed'))
                  }}
                >
                  <DeleteIcon className='h-4 w-4' />
                </Button>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
