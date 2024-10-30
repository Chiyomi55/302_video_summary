import { getRealUrlForVideo } from '@/app/actions/video'
import { useClientTranslation } from '@/app/hooks/use-client-translation'
import { useIsSharePath } from '@/app/hooks/use-is-share-path'
import { Subtitle, useVideoInfoStore } from '@/app/stores/use-video-info-store'
import { logger } from '@/lib/logger'
import { isVideoUrlUsable } from '@/lib/video'
import {
  MediaPlayer,
  type MediaPlayerInstance,
  MediaProvider,
  Poster,
  Track,
  useMediaRemote,
} from '@vidstack/react'
import type { DefaultLayoutTranslations } from '@vidstack/react/player/layouts/default'
import {
  DefaultAudioLayout,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default'
import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'
import { useTrackedEffect } from 'ahooks'
import ISO6391 from 'iso-639-1'
import { env } from 'next-runtime-env'
import {
  type ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import toast from 'react-hot-toast'

interface PlayerProps {
  title: string
  src: string
  id?: string
  type?: string
  translatedSubtitles: Record<string, Subtitle[]>
  language?: string
  poster?: string
}

const Player = forwardRef(function Player(
  { title, id, src, type, translatedSubtitles, language, poster }: PlayerProps,
  ref: ForwardedRef<MediaPlayerInstance>
) {
  const { t } = useClientTranslation()
  const playerRef = useRef<MediaPlayerInstance | null>(null)

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(playerRef.current)
      } else {
        ref.current = playerRef.current
      }
    }
  }, [ref])

  const playerLanguage: DefaultLayoutTranslations = {
    'Caption Styles': t('extras:player.caption_styles'),
    'Captions look like this': t('extras:player.captions_look_like_this'),
    'Closed-Captions Off': t('extras:player.closed-captions_off'),
    'Closed-Captions On': t('extras:player.closed-captions_on'),
    'Display Background': t('extras:player.display_background'),
    'Enter Fullscreen': t('extras:player.enter_fullscreen'),
    'Enter PiP': t('extras:player.enter_pip'),
    'Exit Fullscreen': t('extras:player.exit_fullscreen'),
    'Exit PiP': t('extras:player.exit_pip'),
    'Google Cast': t('extras:player.google_cast'),
    'Keyboard Animations': t('extras:player.keyboard_animations'),
    'Seek Backward': t('extras:player.seek_backward'),
    'Seek Forward': t('extras:player.seek_forward'),
    'Skip To Live': t('extras:player.skip_to_live'),
    'Text Background': t('extras:player.text_background'),
    Accessibility: t('extras:player.accessibility'),
    AirPlay: t('extras:player.airplay'),
    Announcements: t('extras:player.announcements'),
    Audio: t('extras:player.audio'),
    Auto: t('extras:player.auto'),
    Boost: t('extras:player.boost'),
    Captions: t('extras:player.captions'),
    Chapters: t('extras:player.chapters'),
    Color: t('extras:player.color'),
    Connected: t('extras:player.connected'),
    Connecting: t('extras:player.connecting'),
    Continue: t('extras:player.continue'),
    Default: t('extras:player.default'),
    Disabled: t('extras:player.disabled'),
    Disconnected: t('extras:player.disconnected'),
    Download: t('extras:player.download'),
    Family: t('extras:player.family'),
    Font: t('extras:player.font'),
    Fullscreen: t('extras:player.fullscreen'),
    LIVE: t('extras:player.live'),
    Loop: t('extras:player.loop'),
    Mute: t('extras:player.mute'),
    Normal: t('extras:player.normal'),
    Off: t('extras:player.off'),
    Opacity: t('extras:player.opacity'),
    Pause: t('extras:player.pause'),
    PiP: t('extras:player.pip'),
    Play: t('extras:player.play'),
    Playback: t('extras:player.playback'),
    Quality: t('extras:player.quality'),
    Replay: t('extras:player.replay'),
    Reset: t('extras:player.reset'),
    Seek: t('extras:player.seek'),
    Settings: t('extras:player.settings'),
    Shadow: t('extras:player.shadow'),
    Size: t('extras:player.size'),
    Speed: t('extras:player.speed'),
    Text: t('extras:player.text'),
    Track: t('extras:player.track'),
    Unmute: t('extras:player.unmute'),
    Volume: t('extras:player.volume'),
  }

  const allSubtitles = useMemo(() => {
    logger.info('translatedSubtitles changes')
    return Object.entries(translatedSubtitles).map(([language, subtitles]) => ({
      language,
      cues: subtitles?.map((item) => ({
        startTime: item.startTime,
        endTime: item.end,
        text: item.text,
      })),
    }))
  }, [translatedSubtitles])

  const {
    videoId,
    videoType,
    language: currentLanguage,
    originalSubtitles,
    updateVideoInfo,
    originalVideoUrl,
  } = useVideoInfoStore((state) => ({
    videoId: state.id,
    videoType: state.videoType,
    language: state.language,
    originalSubtitles: state.originalSubtitles,
    updateVideoInfo: state.updateAll,
    originalVideoUrl: state.originalVideoUrl,
  }))

  const originalSubtitlesCues = useMemo(() => {
    return originalSubtitles?.map((item) => ({
      startTime: item.startTime,
      endTime: item.end,
      text: item.text,
    }))
  }, [originalSubtitles])

  const remote = useMediaRemote(playerRef.current)

  useTrackedEffect(
    (changes) => {
      for (let i = 0; i < allSubtitles.length; i++) {
        if (allSubtitles[i].language === currentLanguage) {
          remote.changeTextTrackMode(i, 'showing')
        } else {
          remote.changeTextTrackMode(i, 'disabled')
        }
      }
    },
    [allSubtitles, currentLanguage, remote]
  )

  useEffect(() => {
    if (allSubtitles.length === 0) {
      remote.changeTextTrackMode(0, 'showing')
    }
  }, [allSubtitles, remote])

  const realVideoType = useMemo(() => {
    console.log('========', src)
    return src.includes('youtube.com') ? 'video/youtube' : 'video/mp4'
  }, [src])

  const { isSharePage } = useIsSharePath()

  useEffect(() => {
    if (isSharePage) {
      return
    }
    let videoUrl = src
    if (videoUrl.includes('youtube.com')) {
      return
    }
    if (!videoUrl) {
      videoUrl = originalVideoUrl!
    }
    if (videoUrl) {
      isVideoUrlUsable(videoUrl).then((res: boolean) => {
        logger.info('isVideoUrlUsable', res)
        if (!res) {
          const retryGetRealUrl = async (retries = 3) => {
            for (let i = 0; i < retries; i++) {
              const url = await getRealUrlForVideo(
                videoType as string,
                videoId as string,
                env('NEXT_PUBLIC_API_KEY')!
              )
              logger.info(`尝试 ${i + 1}: realVideoUrl`, url)
              if (url) {
                updateVideoInfo({ realVideoUrl: url })
                return
              }
              // 如果不是最后一次尝试,等待一秒后重试
              if (i < retries - 1)
                await new Promise((resolve) => setTimeout(resolve, 1000))
            }
            logger.error('获取真实视频地址失败')
            toast.error(t('home:submit.get_real_url_failed'))
          }
          retryGetRealUrl()
        }
      })
    }
  }, [src, videoType, videoId, updateVideoInfo, originalVideoUrl, t, isSharePage])
  return (
    <MediaPlayer
      ref={playerRef}
      title={title}
      src={{ src: src, type: realVideoType }}
      viewType='video'
      streamType='on-demand'
      logLevel='warn'
      crossOrigin
      className='h-full w-full'
      onError={(error) => {
        logger.error('Player error: %o', error)
      }}
    >
      <MediaProvider>
        <Poster
          className='absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100'
          src={poster}
          alt=''
        />
        <Track
          key='Origin'
          label={'Origin'}
          kind='subtitles'
          language='Origin'
          type='json'
          default={true}
          content={{
            cues: originalSubtitlesCues,
          }}
        />
        {allSubtitles &&
          allSubtitles.map((subtitle) => (
            <Track
              key={subtitle.language}
              label={ISO6391.getNativeName(subtitle.language)}
              kind='subtitles'
              language={subtitle.language}
              type='json'
              default={subtitle.language === currentLanguage}
              content={{
                cues: subtitle.cues,
              }}
            />
          ))}
      </MediaProvider>
      <DefaultVideoLayout
        translations={playerLanguage}
        icons={defaultLayoutIcons}
      />
      <DefaultAudioLayout
        translations={playerLanguage}
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  )
})

export const VideoPlayer = memo(Player)
