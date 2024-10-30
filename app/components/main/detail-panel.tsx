import { generateDetailedSummary } from '@/app/actions/summary'
import { useClientTranslation } from '@/app/hooks/use-client-translation'
import { useCurrentSubtitles } from '@/app/hooks/use-current-subtitles'
import { useUserStore } from '@/app/stores/use-user-store'
import { useVideoInfoStore } from '@/app/stores/use-video-info-store'
import { save } from '@/lib/db'
import { logger } from '@/lib/logger'
import { emitter } from '@/lib/mitt'
import { cn } from '@/lib/utils'
import { readStreamableValue } from 'ai/rsc'
import ISO6391 from 'iso-639-1'
import { env } from 'next-runtime-env'
import { debounce } from 'radash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { ActionCard, CardState } from '../action-card'
import MDRenderer from '../md-renderer'
import MarkmapRenderer from '../mind-map-renderer'
export const DetailPanel = ({
  height,
  className,
}: {
  height: number
  className: string
}) => {
  const currentSubtitles = useCurrentSubtitles()
  const { detail, title, originalSubtitles, updateVideoInfo } =
    useVideoInfoStore((state) => ({
      detail: state.detail,
      title: state.title,
      originalSubtitles: state.originalSubtitles,
      updateVideoInfo: state.updateAll,
    }))
  const { language } = useUserStore((state) => ({
    language: state.language,
  }))
  const apiKey = env('NEXT_PUBLIC_API_KEY')
  const modelName = env('NEXT_PUBLIC_MODEL_NAME')
  const { t } = useClientTranslation()
  const outerRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const contentWrapperRef = useRef<HTMLDivElement>(null)
  const [contentWrapperHeight, setContentWrapperHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)
  const markmapContainerRef = useRef<HTMLDivElement>(null)

  const updateHeight = useCallback(() => {
    if (
      !outerRef.current ||
      !ref.current ||
      !contentWrapperRef.current ||
      !markmapContainerRef.current
    )
      return
    const outerStyle = window.getComputedStyle(outerRef.current!)
    const markmapContainerStyle = window.getComputedStyle(
      markmapContainerRef.current!
    )
    setContentWrapperHeight(
      (height -
        parseFloat(outerStyle.paddingTop) -
        parseFloat(outerStyle.paddingBottom)) /
        2 -
        4
    )
    setContentHeight(
      height / 2 -
        ref.current!.clientHeight -
        parseFloat(markmapContainerStyle.marginTop)
    )
  }, [height])

  useEffect(() => {
    if (!ref.current) return

    updateHeight()
  }, [height, updateHeight])

  useEffect(() => {
    if (!ref.current) return
    const updateWidth = () => {
      setContentWidth(ref.current!.clientWidth)
    }
    const debounceUpdateWidth = debounce({ delay: 300 }, updateWidth)
    updateWidth()
    window.addEventListener('resize', debounceUpdateWidth)
    return () => {
      window.removeEventListener('resize', debounceUpdateWidth)
    }
  }, [ref.current])

  const hasSubtitles = useMemo(() => {
    return currentSubtitles.length > 0
  }, [currentSubtitles])

  const hasDetail = useMemo(() => {
    return detail && detail.length > 0
  }, [detail])

  useEffect(() => {
    if (!hasDetail) {
      return
    }
    updateHeight()
  }, [hasDetail, updateHeight])

  const [detailCardState, setDetailCardState] = useState(CardState.Action)

  const handleGenerateDetail = async () => {
    updateVideoInfo({ detail: '' })
    setDetailCardState(CardState.Loading)

    try {
      const { output } = await generateDetailedSummary(
        currentSubtitles
          ?.map((subtitle) => {
            return subtitle.text
          })
          .join('\n') || '',
        apiKey || '',
        modelName || '',
        ISO6391.getName(language || '')
      )

      let content = ''

      for await (const delta of readStreamableValue(output)) {
        const info = JSON.parse(delta || '{}')
        if (info.type === 'content') {
          content += info.data
        } else if (info.type === 'progress') {
          logger.info('generateDetailedSummary progress: %o', info.percentage)
          } else if (info.type === 'done') {
          logger.info('generateDetailedSummary done')
        }
      }

      content = content.replace(/^```.*\n/gm, '').replace(/^```\s*$/gm, '')

      if (content.length === 0) {
        toast.error(t('home:main.detail.error_generate_detail'))
        setDetailCardState(CardState.Action)
        return
      }

      updateVideoInfo({ detail: content })
      setDetailCardState(CardState.Action)

      toast.success(t('home:main.detail.success_generate_detail'))
      await save(useVideoInfoStore.getState())
    } catch (error) {
      const errCode = JSON.parse(error as string).error.err_code
      emitter.emit('ToastError', errCode)
    }
  }

  return (
    <div
      className={cn('flex flex-col justify-between p-2', className)}
      ref={outerRef}
    >
      {hasDetail ? (
        <>
          <div
            style={{ height: contentWrapperHeight }}
            ref={contentWrapperRef}
            className='flex h-full flex-col justify-center'
          >
            <div className='text-lg font-bold' ref={ref}>
              {t('home:main.detail.detail_summary')}
            </div>
            <div style={{ height: contentHeight }}>
              <MDRenderer
                content={detail || ''}
                onRegenerate={handleGenerateDetail}
              />
            </div>
          </div>
          <div
            style={{ height: contentWrapperHeight }}
            className='mt-2 flex flex-col justify-center'
            ref={markmapContainerRef}
          >
            <div className='text-lg font-bold' ref={ref}>
              {t('home:main.detail.mind_map')}
            </div>
            <div style={{ height: contentHeight }}>
              <MarkmapRenderer
                content={detail || ''}
                height={contentHeight}
                width={contentWidth}
              />
            </div>
          </div>
        </>
      ) : (
        <ActionCard
          className='flex h-full flex-col items-center justify-center'
          stateConfig={{
            loading: {
              title: t('home:main.detail.loading'),
              description: t('home:main.detail.loading_description'),
            },
            empty: {
              title: t('home:main.detail.empty_title'),
              description: t('home:main.detail.empty_description'),
            },
            action: {
              title: t('home:main.detail.action_title'),
              description: t('home:main.detail.action_description'),
            },
          }}
          actionText={t('home:main.detail.action_text')}
          onAction={handleGenerateDetail}
          cardState={detailCardState}
          setCardState={setDetailCardState}
        />
      )}
    </div>
  )
}
