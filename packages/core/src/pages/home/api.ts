import http from '@allkit/http-client'
import { type IBaby } from '@/components/baby-info'
import { type FeedRecordResp } from './types'
import { getToken } from '@/utils'

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
 * 按天分页获取喂养记录列表
 * - 分页单位为"天",某一天的全部记录必定在同一页返回
 * - 返回结构与 apiGetFeedRecordList 一致 `{ list, count }`,count 为总有记录的天数
 */
export const apiGetFeedRecordListByDay = (data = {}) => {
  const option = {
    url: '/baby/feedRecord/pageByDay',
    data: data,
    ignoreToast: [401]
  }
  return http.post<FeedRecordResp>(option)
}

/**
 * 获取宝宝列表
 */
export const apiBabyList = (data = {}) => {
  if (!getToken()) return Promise.resolve([])

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
export const apiAddBabyFoster = (data: { familyId: number; relation: string }) => {
  const option = {
    url: '/baby/addFoster',
    data
  }
  return http.post<IBaby[]>(option)
}

/** 订阅授权上报单项 */
export interface ISubscribeReportItem {
  templateId: string
  status: 'accept' | 'reject'
}

/**
 * 上报订阅授权结果（requestSubscribeMessage 回调中 accept 的调用）
 */
export const apiReportSubscribe = (list: ISubscribeReportItem[]) => {
  return http.post<boolean>({
    url: '/subscribe/report',
    data: { list }
  })
}
