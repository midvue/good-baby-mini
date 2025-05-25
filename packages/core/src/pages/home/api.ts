import { IBaby } from '@/components/baby-info'
import http from '@mid-vue/http-client'
import { type FeedRecordResp } from './types'

/**
 * 获取喂养记录列表
 */
export const apiGetLatestFeedRecords = (data = {}) => {
  const option = {
    url: '/baby/feedRecord/latestFeedRecords',
    data: data,
    ignoreToast: [401]
  }
  return http.post<IFeedRecord[]>(option)
}

/**
 * 获取喂养记录列表
 */
export const apiGetFeedRecordList = (data = {}) => {
  const option = {
    url: '/baby/feedRecord/page',
    data: data,
    ignoreToast: [401]
  }
  return http.post<FeedRecordResp>(option)
}

/**
 * 删除喂养记录
 */
export const apiDeleteFeedRecord = (id: number) => {
  const option = {
    url: `/baby/feedRecord/delete/?id=${id}`
  }
  return http.delete(option)
}

/**
 * 获取宝宝列表
 */
export const apiBabyList = (data = {}) => {
  const option = {
    url: '/baby/list',
    data,
    ignoreToast: true
  }
  return http.post<IBaby[]>(option)
}

/**
 * 添加共同喂养人
 */
export const apiAddBabyFoster = (data: { familyId: number }) => {
  const option = {
    url: '/baby/addFoster',
    data
  }
  return http.post<IBaby[]>(option)
}
