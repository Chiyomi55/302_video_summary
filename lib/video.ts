"use server"

import { logger } from "./logger"

/**
 * Checks if the given video URL is usable.
 * @param url - The video URL to check.
 * @returns Returns a Promise that resolves to `true` if the URL is usable and the content type is video; otherwise, `false`.
 */
export async function isVideoUrlUsable(url: string): Promise<boolean> {
  if (url.includes('/video-proxy')) {
    const _url = new URL(url, 'http://localhost:3000')
    url = _url.searchParams.get('url')!
  }
  try {
    // Attempt to send a HEAD request
    let response = await fetch(url, {
      method: 'HEAD',
    })

    // If the HEAD request is rejected (e.g., 405 Method Not Allowed), try a partial GET request
    if (!response.ok) {
      // Send a GET request with a Range header to avoid downloading the entire video
      response = await fetch(url, {
        method: 'GET',
        headers: {
          Range: 'bytes=0-0', // Request the first byte
        },
      })
    }

    // Check if the response is successful
    if (!response.ok) {
      logger.warn(`Request failed with status code: ${response.status}`)
      return false
    }

    // Check if the content type is video
    const contentType = response.headers.get('Content-Type')
    if (contentType && (contentType.startsWith('video/') || contentType.startsWith('url-media') || contentType.startsWith('audio/mpeg') || contentType.startsWith('application/octet-stream') || contentType.startsWith('application/x-mpegURL'))) {
      return true
    } else {
      logger.warn(`Content type is not video: ${contentType}`)
      return false
    }
  } catch (error) {
    // Catch any network or parsing errors
    logger.error(`Error checking URL: %o`, error)
    return false
  }
}
