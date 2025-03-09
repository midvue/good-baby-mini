import http from '@mid-vue/http-client'
import { IBaby } from './types'

/**
 * 添加喂养记录
 */
export const apiBabyCreate = (data: Partial<IBaby>) => {
  const option = {
    url: '/baby/create',
    data
  }
  return http.post<IBaby>(option)
}

/**
 * 更新喂养记录
 */
export const apiBabyUpdate = (data: Partial<IBaby>) => {
  const option = {
    url: '/baby/update',
    data
  }
  return http.put(option)
}
