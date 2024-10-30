import { produce } from 'immer'
import { create } from 'zustand'
import { Message } from '../components/chatbox/types'
import { storeMiddleware } from './middleware'

export type Subtitle = {
  index: number
  startTime: number
  end: number
  text: string
}

export interface VideoInfoState {
  _hasHydrated: false

  id?: string
  originalVideoUrl?: string
  realVideoUrl?: string
  title?: string
  poster?: string
  videoType?: string
  language?: string
  originalSubtitles?: Subtitle[]
  translatedSubtitles: Record<string, Subtitle[]>
  brief?: string
  detail?: string
  chatMessages?: Message[]

  createdAt: number
  updatedAt: number
}

export interface VideoInfoShare {
  id: string;
  originalVideoUrl: string;
  realVideoUrl: string;
  title: string;
  poster: string;
  videoType: string;
  language: string;
  originalSubtitles: Subtitle[];
  translatedSubtitles: Record<string, Subtitle[]>;
  brief: string;
  detail: string;
}


export interface VideoInfoActions {
  refresh: () => void
  updateField: <T extends keyof VideoInfoState>(
    field: T,
    value: VideoInfoState[T]
  ) => void
  updateAll: (fields: Partial<VideoInfoState>) => void
  setHasHydrated: (value: boolean) => void
}

export const useVideoInfoStore = create<VideoInfoState & VideoInfoActions>()(
  storeMiddleware<VideoInfoState & VideoInfoActions>(
    (set) => ({
      _hasHydrated: false,
      id: '',
      originalVideoUrl: '',
      realVideoUrl: '',
      title: '',
      poster: '',
      videoType: '',
      language: '',
      originalSubtitles: [],
      translatedSubtitles: {},
      brief: '',
      detail: '',
      chatMessages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),

      refresh: () =>
        set(
          produce((state) => {
            state.id = ''
            state.originalVideoUrl = ''
            state.realVideoUrl = ''
            state.title = ''
            state.poster = ''
            state.videoType = ''
            state.language = ''
            state.originalSubtitles = []
            state.translatedSubtitles = {}
            state.brief = ''
            state.detail = ''
            state.chatMessages = []
            state.createdAt = Date.now()
            state.updatedAt = Date.now()
          })
        ),
      updateField: (field, value) =>
        set(
          produce((state) => {
            state[field] = value
            state.updatedAt = Date.now()
          })
        ),
      updateAll: (fields) =>
        set(
          produce((state) => {
            for (const [key, value] of Object.entries(fields)) {
              state[key as keyof VideoInfoState] = value
            }
            state.updatedAt = Date.now()
          })
        ),
      setHasHydrated: (value) =>
        set(
          produce((state) => {
            state._hasHydrated = value
          })
        ),
    }),
    'video_info_store_videosum'
  )
)
