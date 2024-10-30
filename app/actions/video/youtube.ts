"use server"
import { logger } from "@/lib/logger";
import ky from "ky";
import { env } from "next-runtime-env";

interface VideoInfo {
  code: number;
  data: {
    adaptiveFormats: AdaptiveFormat[];
    allowRatings: boolean;
    availableCountries: string[];
    captions: {
      captionTracks: CaptionTrack[];
      translationLanguages: TranslationLanguage[];
    };
    category: string;
    channelId: string;
    channelTitle: string;
    description: string;
    expiresInSeconds: string;
    formats: Format[];
    id: string;
    isFamilySafe: boolean;
    isLiveContent: boolean;
    isPrivate: boolean;
    isProxied: boolean;
    isUnlisted: boolean;
    isUnpluggedCorpus: boolean;
    keywords: string[];
    lengthSeconds: string;
    pmReg: string;
    publishDate: string;
    status: string;
    storyboards: Storyboard[];
    thumbnail: Thumbnail[];
    title: string;
    uploadDate: string;
    viewCount: null;
  };
  params: {
    id: string;
  };
  router: string;
}

interface AdaptiveFormat {
  approxDurationMs: string;
  averageBitrate: number;
  bitrate: number;
  contentLength: string;
  fps: number;
  height: number;
  indexRange: {
    end: string;
    start: string;
  };
  initRange: {
    end: string;
    start: string;
  };
  itag: number;
  lastModified: string;
  mimeType: string;
  projectionType: string;
  quality: string;
  qualityLabel: string;
  url: string;
  width: number;
  colorInfo?: {
    matrixCoefficients: string;
    primaries: string;
    transferCharacteristics: string;
  };
  highReplication?: boolean;
  audioChannels?: number;
  audioQuality?: string;
  audioSampleRate?: string;
  loudnessDb?: number;
  isDrc?: boolean;
  xtags?: string;
}

interface CaptionTrack {
  baseUrl: string;
  isTranslatable: boolean;
  languageCode: string;
  name: string;
  vssId: string;
}

interface TranslationLanguage {
  languageCode: string;
  languageName: string;
}

interface Format {
  approxDurationMs: string;
  audioChannels: number;
  audioQuality: string;
  audioSampleRate: string;
  bitrate: number;
  fps: number;
  height: number;
  itag: number;
  lastModified: string;
  mimeType: string;
  projectionType: string;
  quality: string;
  qualityLabel: string;
  url: string;
  width: number;
}

interface Storyboard {
  columns: string;
  height: string;
  interval: string;
  rows: string;
  storyboardCount: number;
  thumbsCount: string;
  url: string[];
  width: string;
}

interface Thumbnail {
  height: number;
  url: string;
  width: number;
}


export const getRealUrlForYoutube = async (id: string, apiKey: string) => {
  try {
    const API_URL = env('NEXT_PUBLIC_API_URL')!
    const response = await ky
      .get(`${API_URL}/tools/youtube/web/get_video_info`, {
        searchParams: {
          id: id,
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      })
      .json<VideoInfo>();

    if (response.data.formats && response.data.formats.length > 0) {
      const originalUrl = response.data.formats[0].url;
      const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(originalUrl)}`;
      return { ...response, data: { ...response.data, formats: [{ ...response.data.formats[0], url: proxyUrl }] } };
    }

    return response;
  } catch (error) {
    logger.error(error)
    throw new Error('Failed to get real URL for Youtube')
  }
}
