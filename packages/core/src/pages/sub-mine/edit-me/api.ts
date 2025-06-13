import http from '@mid-vue/http-client'

/**
 * 更新个人信息
 */
export const apiUserUpdate = (data: Partial<IUserInfo>) => {
  const option = {
    url: '/app/account/update',
    data
  }
  return http.put(option)
}
