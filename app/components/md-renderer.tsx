'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  FileIcon,
  FileTextIcon,
  Maximize2Icon,
  Minimize2Icon,
  RefreshCcw,
  XIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { useClientTranslation } from '../hooks/use-client-translation'
import { useIsSharePath } from '../hooks/use-is-share-path'
import { useVideoInfoStore } from '../stores/use-video-info-store'

interface MDRendererProps {
  content: string
  className?: string
  contentClassName?: string
  onRegenerate?: () => void
}

export default function MDRenderer({
  content,
  className = '',
  contentClassName = '',
  onRegenerate,
}: MDRendererProps) {
  const { t } = useClientTranslation()
  const { isSharePage } = useIsSharePath()
  const { title } = useVideoInfoStore((state) => ({ title: state.title }))
  const [isFullscreen, setIsFullscreen] = useState(false)
  const fullscreenRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((isFullscreen) => !isFullscreen)
  }, [])

  const downloadText = useCallback(() => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${title}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }, [content, title])

  const downloadMD = useCallback(() => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = `${title}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }, [content, title])

  const { theme } = useTheme()

  const isDark = useMemo(() => {
    return theme === 'dark'
  }, [theme])

  return (
    <Card
      className={`relative h-full w-full overflow-hidden shadow-none ${className}`}
    >
      <div
        className={`absolute right-2 top-1 z-10 flex items-center space-x-2 overflow-hidden rounded-md border border-border bg-background p-1 text-sm transition-opacity duration-300`}
      >
        <Button
          variant='ghost'
          size='sm'
          onClick={onRegenerate}
          className={cn('flex items-center justify-center rounded p-1 hover:bg-accent', isSharePage && 'hidden')}
          aria-label={t('extras:md_renderer.regenerate')}
        >
          <RefreshCcw className='mr-1 h-4 w-4' />
          {t('extras:md_renderer.regenerate')}
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={toggleFullscreen}
          className='flex items-center justify-center rounded p-1 hover:bg-accent'
          aria-label={
            isFullscreen
              ? t('extras:md_renderer.exit_fullscreen')
              : t('extras:md_renderer.enter_fullscreen')
          }
        >
          {isFullscreen ? (
            <Minimize2Icon className='mr-1 h-4 w-4' />
          ) : (
            <Maximize2Icon className='mr-1 h-4 w-4' />
          )}
          {isFullscreen
            ? t('extras:md_renderer.collapse')
            : t('extras:md_renderer.expand')}
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={downloadText}
          className='flex items-center justify-center rounded p-1 hover:bg-accent'
          aria-label={t('extras:md_renderer.download_as_text')}
        >
          <FileTextIcon className='mr-1 h-4 w-4' />
          TXT
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={downloadMD}
          className='flex items-center justify-center rounded p-1 hover:bg-accent'
          aria-label={t('extras:md_renderer.download_as_markdown')}
        >
          <FileIcon className='mr-1 h-4 w-4' />
          MD
        </Button>
      </div>
      <div
        ref={fullscreenRef}
        className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'h-full'}`}
      >
        {isFullscreen && (
          <Button
            variant='outline'
            size='sm'
            onClick={toggleFullscreen}
            className='absolute right-2 top-2 z-10 flex items-center justify-center rounded-full p-2 hover:bg-accent'
            aria-label={t('extras:md_renderer.exit_fullscreen')}
          >
            <XIcon className='h-4 w-4' />
          </Button>
        )}

        <ScrollArea
          className={`prose mx-auto h-full overflow-auto p-4 dark:prose-invert prose-code:bg-transparent prose-pre:bg-transparent prose-pre:p-0 ${contentClassName}`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // @ts-ignore
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    // @ts-ignore
                    style={isDark ? oneDark : oneLight}
                    language={match[1]}
                    PreTag='div'
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </ScrollArea>
      </div>
    </Card>
  )
}
