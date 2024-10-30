'use client'
import { useCurrentSubtitles } from '@/app/hooks/use-current-subtitles'
import { useIsSharePath } from '@/app/hooks/use-is-share-path'
import { useVideoInfoStore } from '@/app/stores/use-video-info-store'
import { CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { MediaPlayerInstance } from '@vidstack/react'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useClientTranslation } from '../../hooks/use-client-translation'
import Card from '../card'
import { VideoPlayer } from '../player'
import SubtitleItem from '../subtitles/item'
import AIPanel from './ai-panel'
import { BriefPanel } from './brief-panel'
import { DetailPanel } from './detail-panel'
import { SubtitlePanel } from './subtitle-panel'

const DESKTOP_WIDTH = 768

const ContentPanel = forwardRef<
  HTMLDivElement,
  {
    activeTab: string
    setActiveTab: (tab: string) => void
    className?: string
    platform?: string
    height: number
    position: 'left' | 'right' | 'center'
  }
>(({ activeTab, setActiveTab, className, platform, height, position }, ref) => {
  const {
    title,
    poster,
    realVideoUrl,
    videoType,
    id,
    language,
    originalSubtitles,
    translatedSubtitles,
  } = useVideoInfoStore((state) => ({
    title: state.title,
    poster: state.poster,
    realVideoUrl: state.realVideoUrl,
    videoType: state.videoType,
    id: state.id,
    language: state.language,
    originalSubtitles: state.originalSubtitles,
    translatedSubtitles: state.translatedSubtitles,
  }))

  const currentSubtitles = useCurrentSubtitles()

  const player = useRef<MediaPlayerInstance>(null)

  const { t } = useClientTranslation()

  const isDesktop = useMediaQuery({ minWidth: DESKTOP_WIDTH })

  const videoHeight = height / 2
  const videoSubtitlesHeight = height - videoHeight

  const shouldShowVideo = useMemo(() => {
    return (
      (!(
        (isDesktop && platform === 'mobile') ||
        (!isDesktop && platform === 'desktop')
      ) ||
        (position === 'center' && !isDesktop)) &&
      position !== 'right'
    )
  }, [isDesktop, platform, position])

  return (
    <Card className={cn('w-full', className)}>
      <CardContent
        className='flex h-full flex-col justify-center p-0'
        ref={ref}
        style={{ height: height }}
      >
        <div className={cn('h-full', activeTab === 'video' ? '' : 'hidden')}>
          <div style={{ height: videoHeight }}>
            {shouldShowVideo && (
              <VideoPlayer
                ref={player}
                src={realVideoUrl || ''}
                type={videoType || ''}
                id={id || ''}
                poster={poster}
                title={title || ''}
                translatedSubtitles={translatedSubtitles}
                language={language}
              />
            )}
          </div>

          <ScrollArea style={{ height: videoSubtitlesHeight }} className='pr-2'>
            <div className='flex flex-col gap-2 p-2'>
              {currentSubtitles?.map((subtitle, index) => (
                <SubtitleItem
                  key={index}
                  subtitle={subtitle}
                  onClick={(startTime) => {
                    player.current?.remoteControl.seek(startTime)
                  }}
                />
              ))}
            </div>
          </ScrollArea>
          {/* <NoContent message={t('home:main.video.no_video_content')} /> */}
        </div>
        <SubtitlePanel
          player={player.current}
          height={height}
          className={cn(activeTab === 'subtitles' ? '' : 'hidden')}
          setActiveTab={setActiveTab}
        />
        {activeTab === 'brief' && <BriefPanel height={height} className='' />}
        {activeTab === 'detailed' && (
          <DetailPanel height={height} className='' />
        )}
        <AIPanel
          className={cn(activeTab === 'ai' ? '' : 'hidden')}
          setActiveTab={setActiveTab}
        />
      </CardContent>
    </Card>
  )
})

ContentPanel.displayName = 'ContentPanel'

const TopTabs = forwardRef<
  HTMLDivElement,
  {
    activeTab: string
    setActiveTab: (tab: string) => void
  }
>(({ activeTab, setActiveTab }, ref) => {
  const { t } = useClientTranslation()
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
      <TabsList
        className='mb-4 grid w-full grid-cols-2 bg-gray-200 dark:bg-gray-800'
        ref={ref}
      >
        <TabsTrigger value='video'>{t('home:main.view_video')}</TabsTrigger>
        <TabsTrigger value='subtitles'>
          {t('home:main.view_subtitles')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
})

TopTabs.displayName = 'TopTabs'

const BottomTabs = forwardRef<
  HTMLDivElement,
  {
    activeTab: string
    setActiveTab: (tab: string) => void
  }
>(({ activeTab, setActiveTab }, ref) => {
  const { t } = useClientTranslation()
  const { isSharePage } = useIsSharePath()

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
      <TabsList
        className={cn('mt-4 grid w-full  bg-gray-200 dark:bg-gray-800', isSharePage ? 'grid-cols-2' : 'grid-cols-3')}
        ref={ref}
      >
        <TabsTrigger value='brief'>{t('home:main.brief_summary')}</TabsTrigger>
        <TabsTrigger value='detailed'>
          {t('home:main.detailed_summary')}
        </TabsTrigger>
        {!isSharePage && (
          <TabsTrigger value='ai'>{t('home:main.ai_question')}</TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  )
})

BottomTabs.displayName = 'BottomTabs'

const DesktopLeftPanel = ({
  activeTab,
  setActiveTab,
  height,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  height: number
}) => {
  const { t } = useClientTranslation()
  const triggerRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (!triggerRef.current) return
    const styles = window.getComputedStyle(triggerRef.current)
    const updateHeight = () => {
      if (!triggerRef.current) return
      const triggerHeight = triggerRef.current.clientHeight
      setContentHeight(height - triggerHeight - parseFloat(styles.marginBottom))
    }
    updateHeight()
  }, [height])
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className='flex h-full w-full flex-col'
    >
      <TabsList
        className='mb-4 grid w-full grid-cols-2 bg-gray-200 dark:bg-gray-800'
        ref={triggerRef}
      >
        <TabsTrigger value='video'>{t('home:main.view_video')}</TabsTrigger>
        <TabsTrigger value='subtitles'>
          {t('home:main.view_subtitles')}
        </TabsTrigger>
      </TabsList>

      <ContentPanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        className='h-full'
        platform='desktop'
        height={contentHeight}
        position='left'
      />
    </Tabs>
  )
}

const DesktopRightPanel = ({
  activeTab,
  setActiveTab,
  height,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  height: number
}) => {
  const { t } = useClientTranslation()
  const { isSharePage } = useIsSharePath()

  const triggerRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  useEffect(() => {
    if (!triggerRef.current) return
    const styles = window.getComputedStyle(triggerRef.current)
    const updateHeight = () => {
      if (!triggerRef.current) return
      const triggerHeight = triggerRef.current.clientHeight
      setContentHeight(height - triggerHeight - parseFloat(styles.marginBottom))
    }
    updateHeight()
  }, [height])
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className='flex h-full w-full flex-col'
    >
      <TabsList
        className={cn('mb-4 grid w-full  bg-gray-200 dark:bg-gray-800', isSharePage ? 'grid-cols-2' : 'grid-cols-3')}
        ref={triggerRef}
      >
        <TabsTrigger value='brief'>{t('home:main.brief_summary')}</TabsTrigger>
        <TabsTrigger value='detailed'>
          {t('home:main.detailed_summary')}
        </TabsTrigger>
        {!isSharePage && (
          <TabsTrigger value='ai'>{t('home:main.ai_question')}</TabsTrigger>
        )}
      </TabsList>
      <ContentPanel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        className='h-full'
        height={contentHeight}
        platform='desktop'
        position='right'
      />
    </Tabs>
  )
}

export default function Main({ height }: { height: number }) {
  const { t } = useClientTranslation()
  const [activeTab, setActiveTab] = useState('video')
  const [activeTabLeft, setActiveTabLeft] = useState('video')
  const [activeTabRight, setActiveTabRight] = useState('brief')
  const isDesktop = useMediaQuery({ minWidth: DESKTOP_WIDTH })

  const topTabsRef = useRef<HTMLDivElement>(null)
  const bottomTabsRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const [mobileContentHeight, setMobileContentHeight] = useState(0)
  const [desktopContentHeight, setDesktopContentHeight] = useState(0)

  // Mobile
  useEffect(() => {
    const updateHeight = () => {
      if (!outerRef.current || !topTabsRef.current || !bottomTabsRef.current)
        return
      const outerStyles = window.getComputedStyle(outerRef.current)
      const topTabsStyles = window.getComputedStyle(topTabsRef.current)
      const bottomTabsStyles = window.getComputedStyle(bottomTabsRef.current)
      const newHeight =
        height -
        (topTabsRef.current?.clientHeight || 0) -
        (bottomTabsRef.current?.clientHeight || 0) -
        parseFloat(outerStyles.paddingTop) -
        parseFloat(outerStyles.paddingBottom) -
        parseFloat(topTabsStyles.marginBottom) -
        parseFloat(bottomTabsStyles.marginTop)
      setMobileContentHeight(newHeight)
    }
    updateHeight()
  }, [height])

  // Desktop
  useEffect(() => {
    const updateHeight = () => {
      if (!outerRef.current) return
      const outerStyles = window.getComputedStyle(outerRef.current)
      const newHeight =
        height -
        (topTabsRef.current?.clientHeight || 0) -
        (bottomTabsRef.current?.clientHeight || 0) -
        parseFloat(outerStyles.paddingTop) -
        parseFloat(outerStyles.paddingBottom)
      setDesktopContentHeight(newHeight)
    }
    updateHeight()
  }, [height])

  return (
    <>
      <div
        className='grid gap-4 py-4 md:grid-cols-2'
        style={{ height: height }}
        ref={outerRef}
      >
        <div
          className={isDesktop ? '' : 'hidden'}
          style={{ height: desktopContentHeight }}
        >
          <DesktopLeftPanel
            activeTab={activeTabLeft}
            setActiveTab={setActiveTabLeft}
            height={desktopContentHeight}
          />
        </div>
        <div
          className={isDesktop ? '' : 'hidden'}
          style={{ height: desktopContentHeight }}
        >
          <DesktopRightPanel
            activeTab={activeTabRight}
            setActiveTab={setActiveTabRight}
            height={desktopContentHeight}
          />
        </div>
        <div className={isDesktop ? 'hidden' : 'flex flex-col'}>
          <TopTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            ref={topTabsRef}
          />

          <ContentPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className='h-full'
            platform='mobile'
            height={mobileContentHeight}
            position='center'
          />

          <BottomTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            ref={bottomTabsRef}
          />
        </div>
      </div>
    </>
  )
}
