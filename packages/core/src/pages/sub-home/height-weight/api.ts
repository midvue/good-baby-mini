import http from '@mid-vue/http-client'

/**
 * 添加喂养记录
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
 */
export const apiUpdateFeedRecord = (data: Partial<IFeedRecord>) => {
  const option = {
    url: '/baby/feedRecord/update',
    data
  }
  return http.put(option)
}

/**
 * 获取最后一条喂养记录
 */
export const apiGetLatestFeedRecords = (data = {}) => {
  const option = {
    url: '/baby/feedRecord/latestFeedRecords',
    data: data,
    ignoreToast: [401]
  }
  return http.post<IFeedRecord<IHeightWeight>[]>(option)
}
