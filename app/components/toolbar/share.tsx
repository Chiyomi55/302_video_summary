'use client'
import { useClientTranslation } from '@/app/hooks/use-client-translation'
import { useVideoInfoStore } from '@/app/stores/use-video-info-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import ky from 'ky'
import { ShareIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'

interface Props {
  className?: string
}
function Share({ className }: Props) {
  const { t } = useClientTranslation()
  const { locale } = useParams()
  const [shareId, setShareId] = useState<string | null>(null)

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const {
    id,
    title,
    poster,
    originalVideoUrl,
    realVideoUrl,
    videoType,
    language,
    originalSubtitles,
    translatedSubtitles,
    brief,
    detail,
  } = useVideoInfoStore((state) => ({
    id: state.id,
    title: state.title,
    poster: state.poster,
    originalVideoUrl: state.originalVideoUrl,
    realVideoUrl: state.realVideoUrl,
    videoType: state.videoType,
    language: state.language,
    originalSubtitles: state.originalSubtitles,
    translatedSubtitles: state.translatedSubtitles,
    brief: state.brief,
    detail: state.detail,
  }))

  const handleShare = useCallback(async () => {
    if (!realVideoUrl) {
      toast.error(t('extras:share.noVideoError'))
      return
    } else if (!brief) {
      toast.error(t('extras:share.noBriefError'))
      return
    } else if (!detail) {
      toast.error(t('extras:share.noDetailError'))
      return
    }
    try {
      const { id: shareId } = await ky
        .post('/api/share', {
          json: {
            id,
            originalVideoUrl,
            realVideoUrl,
            title,
            poster,
            videoType,
            language,
            originalSubtitles,
            translatedSubtitles,
            brief,
            detail,
          },
        })
        .json<{ id: string }>()
      if (shareId) {
        navigator.clipboard.writeText(
          `${window.location.origin}/${locale}/share/${shareId}?lang=${locale}`
        )
        setShareId(shareId)
      }
      if (window.self !== window.top) {
        setShareDialogOpen(true)
      } else {
        toast.success(t('extras:share.success'))
      }
    } catch (error) {
      console.error(error)
      toast.error(t('extras:share.error'))
    }
  }, [
    t,
    locale,

    id,
    originalVideoUrl,
    realVideoUrl,
    title,
    poster,
    videoType,
    language,
    originalSubtitles,
    translatedSubtitles,
    brief,
    detail,
  ])

  return (
    <>
      <Button
        aria-label={t('extras:share.trigger.label')}
        variant='icon'
        size='roundIconSm'
        className={cn(className)}
        onClick={handleShare}
      >
        <ShareIcon className='size-4' />
      </Button>
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{t('extras:share.successIframe')}</DialogTitle>
          </DialogHeader>

          <Input
            value={`${window.location.origin}/${locale}/share/${shareId}?lang=${locale}`}
            onChange={() => {}}
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/${locale}/share/${shareId}?lang=${locale}`
              )
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export { Share }
