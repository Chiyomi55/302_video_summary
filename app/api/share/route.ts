import { VideoInfoShare } from '@/app/stores/use-video-info-store'
import { logger } from '@/lib/logger'
import { existsSync } from 'fs'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { nanoid } from 'nanoid'
import { env } from 'next-runtime-env'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

const SHARE_DIR = join(env('NEXT_PUBLIC_DEFAULT_SHARE_DIR') || 'shared')

export async function POST(request: NextRequest) {
  const videoData: VideoInfoShare = await request.json()
  logger.debug(videoData)
  const id = nanoid()
  const filePath = join(SHARE_DIR, `${id}.json`)
  logger.debug(filePath)

  try {
    if (!existsSync(SHARE_DIR)) {
      await mkdir(SHARE_DIR, { recursive: true })
    }

    await writeFile(filePath, JSON.stringify(videoData, null, 2), 'utf8')
    return NextResponse.json({ id })
  } catch (error) {
    logger.error(error)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID cannot be empty' }, { status: 400 })
  }
  const filePath = join(SHARE_DIR, `${id}.json`)
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'File does not exist' }, { status: 404 })
  }
  const file = await readFile(filePath, 'utf8')
  return NextResponse.json(JSON.parse(file))
}
