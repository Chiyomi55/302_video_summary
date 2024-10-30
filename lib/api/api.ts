'use client'
import { useUserStore } from '@/app/stores/use-user-store'
import { emitter } from '@/lib/mitt'
import ky from 'ky'
import { env } from 'next-runtime-env'
import { isEmpty } from 'radash'
import { logger } from '../logger'
import { langToCountry } from './lang-to-country'

const apiKy = ky.create({
  prefixUrl: env('NEXT_PUBLIC_API_URL'),
  timeout: false,
  hooks: {
    beforeRequest: [
      (request) => {
        const apiKey = env('NEXT_PUBLIC_API_KEY')
        if (apiKey) {
          request.headers.set('Authorization', `Bearer ${apiKey}`)
        }
        const lang = useUserStore.getState().language
        if (lang) {
          request.headers.set('Lang', langToCountry(lang))
        }
      },
    ],
    beforeRetry: [
      (options) => {
        logger.info('beforeRetry', options.retryCount)
        emitter.emit('ToastError', { code: -0, retryCount: options.retryCount })
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          const res = await response.json<{ error: { err_code: number } }>()
          if (!isEmpty(res.error?.err_code)) {
            emitter.emit('ToastError', { code: res.error.err_code })
          }
        }
      },
    ],
  },
})

export { apiKy }
