import { generateBriefSummary } from '@/app/actions/summary'
import { useClientTranslation } from '@/app/hooks/use-client-translation'
import { useCurrentSubtitles } from '@/app/hooks/use-current-subtitles'
import { useUserStore } from '@/app/stores/use-user-store'
import { useVideoInfoStore } from '@/app/stores/use-video-info-store'
import { save } from '@/lib/db'
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
export const BriefPanel = ({
  height,
  className,
}: {
  height: number
  className: string
}) => {
  const currentSubtitles = useCurrentSubtitles()
  const { brief, title, originalSubtitles, updateVideoInfo } =
    useVideoInfoStore((state) => ({
      brief: state.brief,
      title: state.title,
      originalSubtitles: state.originalSubtitles,
      updateVideoInfo: state.updateAll,
    }))
  const {  language } = useUserStore((state) => ({

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
  }, [height, brief, updateHeight])

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

  const hasBrief = useMemo(() => {
    return brief && brief.length > 0
  }, [brief])

  useEffect(() => {
    if (!hasBrief) return

    updateHeight()
  }, [hasBrief, updateHeight])

  const [briefCardState, setBriefCardState] = useState(CardState.Action)

  const handleGenerateBrief = async () => {
    updateVideoInfo({ brief: '' })
    setBriefCardState(CardState.Loading)

    try {
      const { output, error } = await generateBriefSummary(
        title || '',
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
        content += delta
      }

      content = content.replace(/^```.*\n/gm, '').replace(/^```\s*$/gm, '')

      if (content.length === 0) {
        toast.error(t('home:main.brief.generate_error'))
        setBriefCardState(CardState.Action)
        return
      }

      updateVideoInfo({ brief: content })
      setBriefCardState(CardState.Action)

      toast.success(t('home:main.brief.generate_success'))
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
      {hasBrief ? (
        <>
          <div
            style={{ height: contentWrapperHeight }}
            ref={contentWrapperRef}
            className='flex h-full flex-col justify-center'
          >
            <div className='text-lg font-bold' ref={ref}>
              {t('home:main.brief.brief_summary')}
            </div>
            <div style={{ height: contentHeight }}>
              <MDRenderer
                content={brief || ''}
                onRegenerate={handleGenerateBrief}
              />
            </div>
          </div>
          <div
            style={{ height: contentWrapperHeight }}
            className='mt-2 flex flex-col justify-center'
            ref={markmapContainerRef}
          >
            <div className='text-lg font-bold' ref={ref}>
              {t('home:main.brief.mind_map')}
            </div>
            <div style={{ height: contentHeight }}>
              <MarkmapRenderer
                content={brief || ''}
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
              title: t('home:main.brief.loading'),
              description: t('home:main.brief.loading_description'),
            },
            empty: {
              title: t('home:main.brief.empty_title'),
              description: t('home:main.brief.empty_description'),
            },
            action: {
              title: t('home:main.brief.action_title'),
              description: t('home:main.brief.action_description'),
            },
          }}
          actionText={t('home:main.brief.action_text')}
          onAction={handleGenerateBrief}
          cardState={briefCardState}
          setCardState={setBriefCardState}
        />
      )}
    </div>
  )
}
