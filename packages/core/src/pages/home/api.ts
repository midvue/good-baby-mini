import http from '@mid-vue/http-client'
import { type IFeedRecord, type FeedRecordResp } from './types'

/**
 * 获取喂养记录列表
 * @param data 参数
 */
export const apiGetFeedRecordList = (data = {}) => {
  const option = {
    url: '/baby/feedRecord/page',
    data: data
  }
  return http.post<FeedRecordResp>(option)
}

/**
 * 添加喂养记录
 * @param {FeedRecord} data 参数
 */
export const apiAddFeedRecord = (data: Partial<IFeedRecord>) => {
  const option = {
    url: '/baby/feedRecord/create',
    data
  }
  return http.post<IFeedRecord>(option)
}

/**
 * 更新喂养记录
 * @param {FeedRecord} data 参数
 */
export const apiUpdateFeedRecord = (data: Partial<IFeedRecord>) => {
  const option = {
    url: '/baby/feedRecord/update',
    data
  }
  return http.put(option)
}

/**
 * 删除喂养记录
 * @param {FeedRecord} data 参数
 */
export const apiDeleteFeedRecord = (data = {}) => {
  const option = {
    url: '/baby/feedRecord/delete/',
    params: data
  }
  return http.delete(option)
}
