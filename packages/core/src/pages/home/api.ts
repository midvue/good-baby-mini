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

/** 微信 requestSubscribeMessage 回包 status 取值 */
export type SubscribeStatus = 'accept' | 'reject' | 'ban' | 'filter'

/** 订阅授权上报单项 */
export interface ISubscribeReportItem {
  templateId: string
  status: SubscribeStatus
}

/**
 * 上报订阅授权结果（全量上报真实 status，后端按 accept 过滤累加配额）
 */
export const apiReportSubscribe = (list: ISubscribeReportItem[]) => {
  return http.post<boolean>({
    url: '/subscribe/report',
    data: { list }
  })
}
