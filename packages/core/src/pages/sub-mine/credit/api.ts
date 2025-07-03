import http from '@mid-vue/http-client'
import { Point } from './types'

/**
 * 获取积分列表
 */
export const apiPointList = () => {
  const option = {
    url: '/points/record/list'
  }
  return http.post<Point[]>(option)
}

/** 获取积分汇总 */
export const apiPointSummary = () => {
  const option = {
    url: '/points/summary/info'
  }
  return http.post<Point>(option)
}

/**
 * 领取积分
 */
export const apiUpdatePoint = (code: string) => {
  const option = {
    url: `/points/record/update`,
    data: { code }
  }
  return http.post<Point>(option)
}
