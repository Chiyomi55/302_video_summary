'use client'

import {
  VideoInfoActions,
  VideoInfoState,
} from '@/app/stores/use-video-info-store'
import Dexie, { type Table } from 'dexie'
import { omit } from 'radash'

class SessionDatabase extends Dexie {
  sessions!: Table<Omit<VideoInfoState, '_hasHydrated'>>

  constructor() {
    super('VideoSummarySessions')
    this.version(2).stores({
      sessions: '++id, title, createdAt, updatedAt',
    })
  }
}

const db = new SessionDatabase()

export const save = async (session: VideoInfoState & VideoInfoActions) => {
  const result = omit(session, [
    '_hasHydrated',
    'refresh',
    'setHasHydrated',
    'updateField',
    'updateAll',
  ])

  const data = await db.sessions.get(result.id)

  if (data) {
    await db.sessions.update(session.id, { ...result })
  } else {
    await db.sessions.add({
      ...result,
      createdAt: result.createdAt!,
      updatedAt: result.updatedAt!,
    })
  }
}

export const getAll = async () => {
  const sessions = await db.sessions.toArray()
  return sessions.sort((prev, next) => next.updatedAt - prev.updatedAt)
}

export const remove = async (id: string) => {
  await db.sessions.delete(id)
}
