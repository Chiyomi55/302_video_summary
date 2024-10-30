'use client'
import { Footer } from '@/app/components/footer'
import { useTranslation } from '@/app/i18n/client'
import { transcript } from '@/lib/api/transcript'
import { save } from '@/lib/db'
import { logger } from '@/lib/logger'
import { cn } from '@/lib/utils'
import { env } from 'next-runtime-env'
import { debounce } from 'radash'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { getRealUrlForVideo } from '../actions/video'
import { getRealUrlForDouyin } from '../actions/video/douyin'
import { getRealUrlForTiktok } from '../actions/video/tiktok'
import { getRealUrlForYoutube } from '../actions/video/youtube'
import { useChat } from '../components/chatbox/hooks'
import { Header } from '../components/header'
import Main from '../components/main'
import { useHasSubtitles } from '../hooks/use-has-subtitles'
import { useVideoInfoStore } from '../stores/use-video-info-store'

export default function Home({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const { t } = useTranslation(locale)
  const { resetMessages } = useChat()

  const { updateVideoInfo, refresh } = useVideoInfoStore((state) => ({
    updateVideoInfo: state.updateAll,
    refresh: state.refresh,
  }))

  const hasSubtitles = useHasSubtitles()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const onSubmit = async (url: string) => {
    setIsSubmitting(true)

    refresh()
    resetMessages()

    let originalUrl = url
    let tmpUrl = url
    let title = ''
    let isDouyin = false
    let isTiktok = false
    let isXiaohongshu = false
    let isBilibili = false
    let isYoutube = false
    if (
      originalUrl.includes('douyin') &&
      !originalUrl.endsWith('.mp3') &&
      !originalUrl.includes('mime_type=video_mp4')
    ) {
      try {
        const resp = await getRealUrlForDouyin(
          originalUrl,
          env('NEXT_PUBLIC_API_KEY')!
        )
        if (!resp) {
          toast.error(t('home:submit.get_real_url_failed'))
          setIsSubmitting(false)
          return
        }
        tmpUrl =
          resp.data.aweme_details.at(0)?.music.play_url.url_list.at(0) || ''
        url =
          resp.data.aweme_details.at(0)?.video.play_addr.url_list.at(0) || ''
        title = resp.data.aweme_details.at(0)?.share_info.share_title || ''
        isDouyin = true
      } catch (e) {
        logger.error(e)
        toast.error(t('home:submit.get_real_url_failed'))
        setIsSubmitting(false)
        return
      }
    } else if (
      originalUrl.includes('tiktok') &&
      !originalUrl.endsWith('.mp3') &&
      !originalUrl.includes('mime_type=video_mp4')
    ) {
      try {
        const resp = await getRealUrlForTiktok(
          originalUrl,
          env('NEXT_PUBLIC_API_KEY')!
        )
        if (!resp) {
          toast.error(t('home:submit.get_real_url_failed'))
          setIsSubmitting(false)
          return
        }
        tmpUrl =
          resp.data.aweme_details.at(0)?.music.play_url.url_list.at(0) || ''
        url =
          resp.data.aweme_details.at(0)?.video.play_addr.url_list.at(0) || ''
        title = resp.data.aweme_details.at(0)?.share_info.share_title || ''
        isTiktok = true
      } catch (e) {
        logger.error(e)
        toast.error(t('home:submit.get_real_url_failed'))
        setIsSubmitting(false)
        return
      }
    } else if (originalUrl.includes('youtube.com')) {
      try {
        const params = new URLSearchParams(originalUrl.split('?')[1])
        const videoId = params.get('v')
        if (!videoId) {
          toast.error(t('home:submit.invalid_youtube_url'))
          setIsSubmitting(false)
          return
        }
        const resp = await getRealUrlForYoutube(
          videoId,
          env('NEXT_PUBLIC_API_KEY')!
        )
        if (!resp) {
          logger.error(t('home:submit.get_real_url_failed'))
          url = `https://www.youtube.com/watch?v=${videoId}`
          title = ''
          isYoutube = true
        } else {
          url = resp.data.formats.at(0)?.url || ''
          title = resp.data.title || ''
          isYoutube = true
        }
      } catch (e) {
        logger.error(t('home:submit.get_real_url_failed'))
      }
    }

    // 获取字幕
    let data
    try {
      data = await transcript(t, tmpUrl)
    } catch (e) {
      toast.error(t('home:submit.transcript_failed'))
      setIsSubmitting(false)
      return
    }

    if (!data) {
      toast.error(t('home:submit.transcript_failed'))
      setIsSubmitting(false)

      return
    }

    updateVideoInfo({
      id: data.detail.id || Date.now().toString(),
      title: data.detail.title,
      videoType: data.detail.type,
      poster: data.detail.cover,
      originalSubtitles: data.detail.subtitlesArray,
      originalVideoUrl: originalUrl,
    })

    if (data.detail.type === 'bilibili') {
      const url = await getRealUrlForVideo('bilibili', data.detail.id)
      if (!url) {
        toast.error(t('home:submit.get_real_url_failed'))
        setIsSubmitting(false)
        return
      }
      updateVideoInfo({ realVideoUrl: url })
    } else if (data.detail.type === 'youtube') {
      updateVideoInfo({ videoType: 'youtube', realVideoUrl: url })
    } else if (data.detail.url.includes('xiaohongshu')) {
      const url = await getRealUrlForVideo(
        'xiaohongshu',
        data.detail.id,
        env('NEXT_PUBLIC_API_KEY')!
      )
      if (!url) {
        toast.error(t('home:submit.get_real_url_failed'))
        setIsSubmitting(false)
        return
      }
      updateVideoInfo({
        videoType: 'xiaohongshu',
        realVideoUrl: url,
        title: data.detail.descriptionText,
      })
    } else if (isDouyin) {
      updateVideoInfo({ videoType: 'douyin', title: title, realVideoUrl: url })
    } else if (isTiktok) {
      updateVideoInfo({
        id: originalUrl,
        videoType: 'tiktok',
        title: title,
        realVideoUrl: url,
      })
    } else {
      updateVideoInfo({ realVideoUrl: data.detail.url })
    }

    try {
      await save(useVideoInfoStore.getState())
    } catch (e) {
      toast.error(t('home:submit.save_failed'))
      setIsSubmitting(false)
      return
    }
    toast.success(t('home:submit.success'))
    setIsSubmitting(false)
  }

  const headerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const [mainHeight, setMainHeight] = useState(0)

  useEffect(() => {
    const calculateMainHeight = () => {
      if (!headerRef.current || !footerRef.current) return

      const headerRect = headerRef.current.getBoundingClientRect()
      const footerRect = footerRef.current.getBoundingClientRect()
      const headerMargin = parseFloat(
        window.getComputedStyle(headerRef.current).marginTop
      )
      const footerMargin = parseFloat(
        window.getComputedStyle(footerRef.current).marginBottom
      )
      const mainHeight =
        window.innerHeight -
        headerRect.height -
        footerRect.height -
        headerMargin -
        footerMargin
      mainRef.current?.style.setProperty('height', `${mainHeight}px`)
      setMainHeight(mainHeight)
    }

    const debouncedCalculateMainHeight = debounce(
      {
        delay: 100,
      },
      calculateMainHeight
    )

    calculateMainHeight()

    const resizeObserver = new ResizeObserver(debouncedCalculateMainHeight)

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current)
    }
    if (footerRef.current) {
      resizeObserver.observe(footerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className='flex h-fit min-h-screen flex-col justify-between'>
      <div
        className={cn(hasSubtitles && !isSubmitting ? 'hidden' : 'block')}
      ></div>
      <Header
        className={cn(hasSubtitles && !isSubmitting ? 'mt-8' : 'mt-0')}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        ref={headerRef}
      />
      <main
        className={cn(
          hasSubtitles && !isSubmitting ? 'block' : 'hidden',
          'container mx-auto min-h-[500px] max-w-[1280px] px-2'
        )}
        ref={mainRef}
      >
        <Main height={mainHeight} />
      </main>
      <Footer className={cn('mb-4')} ref={footerRef} />
    </div>
  )
}
