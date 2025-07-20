import http from '@mid-vue/http-client'

/**
 * 获取喂养记录列表
 */
export const apiPostRelation = (data = {}) => {
  const option = {
    url: '/babyFamily/relation',
    data,
    ignoreToast: [401]
  }
  return http.post(option)
}
