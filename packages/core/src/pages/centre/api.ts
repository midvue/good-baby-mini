import http from '@mid-vue/http-client'

/**
 * 获取家庭关系
 */
export const apiPostRelation = (data = {}) => {
  const option = {
    url: '/babyFamily/relation',
    data,
    ignoreToast: [401]
  }
  return http.post(option)
}
