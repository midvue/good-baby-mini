import { IBaby } from '@/components/baby-info'
import http from '@mid-vue/http-client'
import { type FeedRecordResp } from './types'

/**
 * 获取喂养记录列表
 */
export const apiGetFeedRecordList = (data = {}) => {
  const option = {
    url: '/baby/feedRecord/page',
    data: data
  }
  return http.post<FeedRecordResp>(option)
}

/**
 * 删除喂养记录
 */
export const apiDeleteFeedRecord = (data = {}) => {
  const option = {
    url: '/baby/feedRecord/delete/',
    params: data
  }
  return http.delete(option)
}

/**
 * 获取宝宝列表
 */
export const apiBabyList = (data = {}) => {
  const option = {
    url: '/baby/list',
    data
  }
  return http.post<IBaby[]>(option)
}
