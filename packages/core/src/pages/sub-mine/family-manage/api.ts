import http from '@mid-vue/http-client'

/**
 * 家庭列表
 */
export const apiFamilyList = () => {
  const option = {
    url: '/babyFamily/list'
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
