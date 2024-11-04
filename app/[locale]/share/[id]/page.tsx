'use client'
import { Footer } from '@/app/components/footer'
import { Header } from '@/app/components/header'
import Main from '@/app/components/main'
import { useTranslation } from '@/app/i18n/client'
import {
  useVideoInfoStore,
  VideoInfoState,
} from '@/app/stores/use-video-info-store'
import { showBrand } from '@/lib/brand'
import { cn } from '@/lib/utils'
import ky from 'ky'
import { useParams } from 'next/navigation'
import { debounce } from 'radash'
import { useEffect, useRef, useState } from 'react'

export default function Share({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const { t } = useTranslation(locale)
  const { id: shareId } = useParams()
  const { updateVideoInfo } = useVideoInfoStore((state) => ({
    updateVideoInfo: state.updateAll,
  }))

  useEffect(() => {
    const _getVideoInfo = async () => {
      if (!shareId) {
        return
      }
      const videoInfo = await ky
        .get(`/api/share?id=${shareId}`)
        .json<VideoInfoState>()
      updateVideoInfo(videoInfo)
    }
    _getVideoInfo()
  }, [shareId, updateVideoInfo])

  const onSubmit = async (url: string) => {}

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
      <Header
        className={cn('mt-8')}
        isSubmitting={false}
        onSubmit={onSubmit}
        ref={headerRef}
      />
      <main
        className={cn(
          'block',
          'container mx-auto min-h-[500px] max-w-[1280px] px-2'
        )}
        ref={mainRef}
      >
        <Main height={mainHeight} />
      </main>
      {!showBrand && <footer ref={footerRef} />}
      {showBrand && <Footer className={cn('mb-4')} ref={footerRef} />}
    </div>
  )
}
