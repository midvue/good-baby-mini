import http from '@mid-vue/http-client'
import { FeedRecordResp } from './types'

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
