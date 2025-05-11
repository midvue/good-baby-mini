import http from '@mid-vue/http-client'

/**
 * 获取喂养记录
 */
export const apiFeedRecordList = <T>(
  data: Partial<IFeedRecord> & { startFeedTime?: string; endFeedTime?: string }
) => {
  const option = {
    url: '/baby/feedRecord/list',
    data
  }
  return http.post<IFeedRecord<T>[]>(option)
}
