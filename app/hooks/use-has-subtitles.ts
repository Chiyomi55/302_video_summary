import { useVideoInfoStore } from '../stores/use-video-info-store'

export function useHasSubtitles() {
  const { originalSubtitles } = useVideoInfoStore()
  return originalSubtitles && originalSubtitles.length > 0
}
