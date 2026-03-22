import http from '@allkit/http-client'
import { IWeekly } from './types'

/**
 * 周报列表
 */
export const apiGetReportWeek = (data = {}) => {
  const option = {
    url: '/baby/feedRecordStatistics/week',
    data
  }
  return http.post<IWeekly>(option)
}

/**
 * 周报详情
 */
export const apiGetReportDetail = (data: Partial<IFeedRecord>) => {
  const option = {
    url: '/baby/feedRecordStatistics/detail',
    data
  }
  return http.post(option)
}

/**
 * 获取家庭关系
 */
export const apiPostRelation = (data = {}) => {
  const option = {
    url: '/babyFamily/relation',
    data
  }
  return http.post<{ userId: string; relation: string }[]>(option)
}
