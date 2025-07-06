import http from '@mid-vue/http-client'
/**
 * 删除喂养记录
 */
export const apiDeleteFeedRecord = (id: number) => {
  const option = {
    url: `/baby/feedRecord/delete/?id=${id}`
  }
  return http.delete(option)
}
