import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { logger } from '@/lib/logger'
import { detectUrl, isValidUrl } from '@/lib/url'
import { cn } from '@/lib/utils'
import { ReloadIcon } from '@radix-ui/react-icons'
import { forwardRef, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useClientTranslation } from '../hooks/use-client-translation'
import useFileUpload from '../hooks/use-file-upload'
import { useIsSharePath } from '../hooks/use-is-share-path'
import { useVideoInfoStore } from '../stores/use-video-info-store'
import { History } from './history'
import LogoIcon from './logo-icon'

interface Props {
  className?: string
  isSubmitting?: boolean
  onSubmit?: (url: string) => void
}

const Header = forwardRef<HTMLDivElement, Props>(
  ({ className, isSubmitting, onSubmit }, ref) => {
    const { t } = useClientTranslation()
    const { isSharePage } = useIsSharePath()

    const { originalVideoUrl } = useVideoInfoStore((state) => ({
      originalVideoUrl: state.originalVideoUrl,
    }))

    const [url, setUrl] = useState<string | undefined>(originalVideoUrl)

    useEffect(() => {
      logger.info('originalVideoUrl: %s', originalVideoUrl)
      setUrl(originalVideoUrl)
    }, [originalVideoUrl])

    const handleSubmit = async () => {
      const newUrl = detectUrl(url ?? '')
      if (!newUrl || !isValidUrl(newUrl)) {
        logger.error('URL is %s', newUrl)
        toast.error(t('home:header.no_include_valid_url'))
        return
      }
      setUrl(newUrl)
      onSubmit?.(newUrl)
    }

    const { upload, isLoading, error } = useFileUpload()

    const handleUpload = async () => {
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      // fileInput.accept = 'video/*,audio/*'
      fileInput.accept = 'audio/*'
      fileInput.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          logger.info('upload file: %o', file)

          const result = await upload({
            file,
            prefix: 'user-uploads',
            needCompress: true,
            maxSizeInBytes: 20 * 1024 * 1024,
          })

          if (!result) {
            logger.error(
              'upload failed, result is %o, error is %o',
              result,
              error
            )
            toast.error(t('home:header.upload_failed'))
            return
          }

          const {
            data: { url },
          } = result
          setUrl(url)
          onSubmit?.(url)
        }
      }
      fileInput.click()
    }
    return (
      <header
        className={cn(
          'flex flex-col items-center justify-center space-y-4 px-2',
          className
        )}
        ref={ref}
      >
        <div className='flex items-center space-x-4'>
          <LogoIcon className='size-8 flex-shrink-0' />
          <h1 className='break-all text-3xl font-bold leading-tight tracking-tighter transition-all sm:text-4xl lg:leading-[1.1]'>
            {t('home:header.title')}
          </h1>
        </div>
        <div className='mx-2 flex w-full flex-shrink-0 flex-col items-center justify-center gap-2 text-xs sm:flex-row sm:gap-4'>
          <div className='w-full flex-grow sm:w-auto sm:max-w-sm'>
            <Input
              color='primary'
              className='w-full bg-white dark:bg-background'
              placeholder={t('home:header.url_input_placeholder')}
              disabled={isSubmitting || isSharePage}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className={cn('flex items-center justify-center gap-2', isSharePage && 'hidden')}>
            <Button disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? (
                <>
                  <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                  {t('home:header.start_button_loading')}
                </>
              ) : (
                t('home:header.start_button')
              )}
            </Button>
            <span className='w-fit flex-shrink-0'>{t('home:header.or')}</span>
            <Button disabled={isSubmitting || isLoading} onClick={handleUpload}>
              {isSubmitting || isLoading ? (
                <>
                  <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                  {t('home:header.start_button_loading')}
                </>
              ) : (
                t('home:header.upload_button')
              )}
            </Button>
            <History disabled={isSubmitting} />
          </div>
        </div>
        <div className='text-center text-sm text-muted-foreground'>
          {t('home:header.description')}
        </div>
      </header>
    )
  }
)

Header.displayName = 'Header'

export { Header }
