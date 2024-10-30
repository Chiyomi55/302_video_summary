import { logger } from '@/lib/logger'
import ky from 'ky'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Invalid URL parameter' }, { status: 400 })
  }

  try {
    const response = await ky.get(url, {
      timeout: false,
      onDownloadProgress: () => {},
    })

    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', '*')

    return new NextResponse(response.body, {
      headers,
      status: response.status,
      statusText: response.statusText,
    })
  } catch (error) {
    logger.error('Error while proxying video: %o', error)
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 500 })
  }
}
