'use client'
import mitt from 'mitt'
type Events = {
  ToastError: {
    code: number
    retryCount?: number
  }
}
const emitter = mitt<Events>()

export { emitter }
