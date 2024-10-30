import { useMemo } from 'react'
import { useVideoInfoStore } from '../stores/use-video-info-store'

export const useCurrentSubtitles = () => {
  const { originalSubtitles, translatedSubtitles, language } =
    useVideoInfoStore((state) => ({
      originalSubtitles: state.originalSubtitles,
      translatedSubtitles: state.translatedSubtitles,
      language: state.language,
    }))
  return useMemo(() => {
    return translatedSubtitles[language || ''] || originalSubtitles
  }, [language, originalSubtitles, translatedSubtitles])
}
