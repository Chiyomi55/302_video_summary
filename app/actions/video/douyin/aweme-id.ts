import { logger } from '@/lib/logger'
import ky from 'ky'
import { env } from 'next-runtime-env'

interface Response {
  code: number
  data: string
  params: {
    url: string
  }
  router: string
}

export const getAwemeId = async (url: string, apiKey: string) => {
  const API_URL = env('NEXT_PUBLIC_API_URL')!
  try {
    const response = await ky
      .get(`${API_URL}/tools/douyin/web/get_aweme_id`, {
        searchParams: {
          url: url,
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      })
      .json<Response>()

    return response.data
  } catch (error) {
    logger.error(error)
    return null
  }
}
