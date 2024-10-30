'use server'
import { logger } from '@/lib/logger'
import { getRealUrlForBilibili } from './video/bilibili'
import { getRealUrlForDouyin } from './video/douyin'
import { getRealUrlForTiktok } from './video/tiktok'
import { getRealUrlForXiaohongshu } from './video/xiaohongshu'
import { getRealUrlForYoutube } from './video/youtube'

export const getRealUrlForVideo = async (type: string, ...extras: string[]) => {
  logger.info('getRealUrlForVideo %s %s', type, extras[1])
  try {
    if (type === 'bilibili') {
      return (await getRealUrlForBilibili(extras[0]))?.data.durl.at(-1)?.url
  } else if (type === 'youtube') {
    return (await getRealUrlForYoutube(extras[0], extras[1]))?.data.formats.at(
      0
    )?.url
  } else if (type === 'xiaohongshu') {
    return (
      await getRealUrlForXiaohongshu(extras[0], extras[1])
    )?.data.data.data
      .at(0)
      ?.note_list.at(0)?.video.url
  } else if (type === 'douyin') {
    return (await getRealUrlForDouyin(extras[0], extras[1]))?.data.aweme_details
      .at(0)
      ?.video.play_addr.url_list.at(0)
  } else if (type === 'tiktok') {
    return (await getRealUrlForTiktok(extras[0], extras[1]))?.data.aweme_details
      .at(0)
        ?.video.play_addr.url_list.at(0)
    }
  } catch (error) {
    logger.error(error)
    throw new Error('Failed to get real URL for Video')
  }
}
