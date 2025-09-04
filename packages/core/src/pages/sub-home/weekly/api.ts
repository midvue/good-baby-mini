import http from '@mid-vue/http-client'
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
