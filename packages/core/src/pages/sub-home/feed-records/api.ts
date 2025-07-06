import http from '@mid-vue/http-client'
import { type FeedRecordResp } from './types'
import { ICalendarItem } from './components/calendar/type'

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
 * 获取喂养记录列表
 */
export const apiGetFeedRecordDays = (data = {}) => {
  const option = {
    url: '/baby/feedRecord/days',
    data: data,
    ignoreToast: [401]
  }
  return http.post<ICalendarItem[]>(option)
}
