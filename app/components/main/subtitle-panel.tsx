import { useClientTranslation } from '@/app/hooks/use-client-translation'
import { useCurrentSubtitles } from '@/app/hooks/use-current-subtitles'
import { useIsSharePath } from '@/app/hooks/use-is-share-path'
import { languages } from '@/app/i18n/settings'
import { Subtitle, useVideoInfoStore } from '@/app/stores/use-video-info-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { translate } from '@/lib/api/transcript'
import { save } from '@/lib/db'
import { cn } from '@/lib/utils'
import { ReloadIcon } from '@radix-ui/react-icons'
import { MediaPlayerInstance } from '@vidstack/react'
import ISO639 from 'iso-639-1'
import { debounce } from 'radash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import SubtitleItem from '../subtitles/item'

export const SubtitlePanel = ({
  player,
  height,
  className,
  setActiveTab,
}: {
  player: MediaPlayerInstance | null
  height: number
  className?: string
  setActiveTab: (tab: string) => void
}) => {
  const { t } = useClientTranslation()
  const { isSharePage } = useIsSharePath()

  const {
    title,
    poster,
    realVideoUrl,
    videoType,
    id,
    language,
    originalSubtitles,
    translatedSubtitles,
    updateVideoInfo,
  } = useVideoInfoStore((state) => ({
    title: state.title,
    poster: state.poster,
    realVideoUrl: state.realVideoUrl,
    videoType: state.videoType,
    id: state.id,
    language: state.language,
    originalSubtitles: state.originalSubtitles,
    translatedSubtitles: state.translatedSubtitles,
    updateVideoInfo: state.updateAll,
  }))

  const langs = useMemo(() => {
    const langs = [
      {
        key: 'Original',
        label: t('home:main.subtitles.original'),
      },
      ...(isSharePage
        ? Object.keys(translatedSubtitles)
            .map((language) => {
              return {
                key: language,
                label: ISO639.getNativeName(language),
              }
            })
            .filter(Boolean)
        : languages.map((language) => {
            return {
              key: language,
              label: ISO639.getNativeName(language),
            }
          })),
    ]
    return langs
  }, [isSharePage, translatedSubtitles, t])

  const selectedLanguage = useVideoInfoStore((state) => state.language)!
  const setSelectedLanguage = useCallback(
    (language: string) => {
      updateVideoInfo({ language })
    },
    [updateVideoInfo]
  )

  const currentSubtitles = useCurrentSubtitles()

  const hasTranslation = useMemo(() => {
    return (
      translatedSubtitles[selectedLanguage] &&
      (translatedSubtitles[selectedLanguage] as Subtitle[]).length
    )
  }, [translatedSubtitles, selectedLanguage])

  useEffect(() => {
    if (hasTranslation) {
      save(useVideoInfoStore.getState())
    }
  }, [selectedLanguage, hasTranslation])

  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = useCallback(async () => {
    if (!selectedLanguage) {
      toast.error(t('home:main.subtitles.select_language_error'))
      return
    }

    setIsTranslating(true)

    try {
      const translated = await translate(
        t,
        originalSubtitles || [],
        selectedLanguage
      )
      updateVideoInfo({
        translatedSubtitles: {
          ...translatedSubtitles,
          [selectedLanguage]: translated,
        },
      })
      toast.success(t('home:main.subtitles.translate_subtitle_success'))
      await save(useVideoInfoStore.getState())
    } catch (error) {
      toast.error(t('home:main.subtitles.translate_subtitle_error'))
    } finally {
      setIsTranslating(false)
    }
  }, [
    selectedLanguage,
    translatedSubtitles,
    updateVideoInfo,
    originalSubtitles,
    t,
  ])

  const subtitleTypes = useMemo(
    () => [
      { label: 'vtt', value: 'vtt' },
      { label: 'srt', value: 'srt' },
      { label: 'txt', value: 'txt' },
    ],
    []
  )

  const [selectedSubtitleType, setSelectedSubtitleType] = useState(
    subtitleTypes[0].value
  )

  const convertTimeToVTTFormat = useCallback((time: number): string => {
    const date = new Date(time * 1000)
    return date.toISOString().substr(11, 12).replace('.', ',')
  }, [])

  const convertTimeToSRTFormat = useCallback((time: number): string => {
    const date = new Date(time * 1000)
    return date.toISOString().substr(11, 12).replace('.', ',')
  }, [])

  const formatVTT = useCallback(
    (subtitles: Subtitle[]): string => {
      let content = 'WEBVTT\n\n'
      for (const subtitle of subtitles) {
        const startTime = convertTimeToVTTFormat(subtitle.startTime)
        const endTime = convertTimeToVTTFormat(subtitle.end)
        content += `${startTime} --> ${endTime}\n${subtitle.text}\n\n`
      }
      return content
    },
    [convertTimeToVTTFormat]
  )

  const formatSRT = useCallback(
    (subtitles: Subtitle[]): string => {
      return subtitles
        .map((subtitle, index) => {
          const startTime = convertTimeToSRTFormat(subtitle.startTime)
          const endTime = convertTimeToSRTFormat(subtitle.end)
          return `${index + 1}\n${startTime} --> ${endTime}\n${subtitle.text}\n\n`
        })
        .join('')
    },
    [convertTimeToSRTFormat]
  )

  const formatText = useCallback((subtitles: Subtitle[]): string => {
    return subtitles.map((subtitle) => `${subtitle.text}\n\n`).join('')
  }, [])

  const handleDownload = useCallback(() => {
    const subtitles: Subtitle[] = currentSubtitles || []
    let content = ''

    switch (selectedSubtitleType) {
      case 'vtt':
        content = formatVTT(subtitles)
        break
      case 'srt':
        content = formatSRT(subtitles)
        break
      case 'txt':
        content = formatText(subtitles)
        break
      default:
        throw new Error(`Unsupported subtitle type: ${selectedSubtitleType}`)
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title}.${selectedSubtitleType}`
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setSelectedSubtitleType(subtitleTypes[0].value)
  }, [
    selectedSubtitleType,
    formatSRT,
    formatText,
    formatVTT,
    title,
    subtitleTypes,
    currentSubtitles,
  ])

  const [inputValue, setInputValue] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  const debouncedSearch = useCallback((value: string) => {
    debounce({ delay: 300 }, (value) => {
      setDebouncedSearchText(value)
    })(value)
  }, [])

  useEffect(() => {
    debouncedSearch(inputValue)
  }, [inputValue, debouncedSearch])

  const filteredSubtitles = useMemo(() => {
    if (!debouncedSearchText) return currentSubtitles

    return currentSubtitles?.filter((subtitle) =>
      subtitle.text.toLowerCase().includes(debouncedSearchText.toLowerCase())
    )
  }, [debouncedSearchText, currentSubtitles])

  return (
    <div className={cn('flex h-full flex-col justify-between', className)}>
      <div className='flex items-center justify-center gap-4 p-2'>
        <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
          <SelectTrigger className='flex-1'>
            <SelectValue
              placeholder={t(
                'home:main.subtitles.translate_subtitle_placeholder'
              )}
            />
          </SelectTrigger>
          <SelectContent>
            {langs.map((language) => (
              <SelectItem key={language.key} value={language.key}>
                {language.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedLanguage !== 'Original' && !isSharePage ? (
          hasTranslation ? (
            <Button onClick={handleTranslate} disabled={isTranslating}>
              {isTranslating ? (
                <>
                  <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                  {t('home:main.subtitles.translating')}
                </>
              ) : (
                t('home:main.subtitles.reTranslate_subtitle')
              )}
            </Button>
          ) : (
            <Button onClick={handleTranslate}>
              {isTranslating ? (
                <>
                  <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                  {t('home:main.subtitles.translating')}
                </>
              ) : (
                t('home:main.subtitles.translate_subtitle')
              )}
            </Button>
          )
        ) : null}
      </div>
      <div className='p-2'>
        <Input
          className='w-full'
          placeholder={t('home:main.subtitles.search_placeholder')}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <ScrollArea className='flex-1 pr-2'>
        <div className='flex flex-col gap-2 p-2'>
          {filteredSubtitles?.map((subtitle, index) => (
            <SubtitleItem
              key={index}
              subtitle={subtitle}
              searchText={debouncedSearchText}
              onClick={(startTime) => {
                player?.remoteControl.seek(startTime)
                setActiveTab('video')
              }}
            />
          ))}
        </div>
      </ScrollArea>
      <div className='flex items-center justify-center gap-4 p-2'>
        <Select
          onValueChange={setSelectedSubtitleType}
          value={selectedSubtitleType}
        >
          <SelectTrigger className='flex-1'>
            <SelectValue
              placeholder={t('home:main.subtitles.select_placeholder')}
            />
          </SelectTrigger>
          <SelectContent>
            {subtitleTypes.map((subtitleType) => (
              <SelectItem key={subtitleType.value} value={subtitleType.value}>
                {subtitleType.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleDownload}>
          {t('home:main.subtitles.download_subtitle')}
        </Button>
      </div>
    </div>
  )
}
