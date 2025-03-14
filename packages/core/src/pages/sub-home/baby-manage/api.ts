import http from '@mid-vue/http-client'

/**
 * 宝宝列表
 */
export const apiBabyList = () => {
  const option = {
    url: '/baby/list'
  }
  return http.post<BabyInfo[]>(option)
}

/**
 * 更新喂养记录
 */
export const apiUpdateFeedRecord = (data: Partial<BabyInfo>) => {
  const option = {
    url: '/baby/delete',
    data
  }
  return http.put(option)
}
