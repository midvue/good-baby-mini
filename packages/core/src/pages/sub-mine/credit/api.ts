import http from '@allkit/http-client'
import { Point, PointSummary } from './types'

/**
 * 获取积分任务列表
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
  return http.post<PointSummary>(option)
}

/**
 * 获取今日积分
 */
export const apiPointToday = () => {
  const option = {
    url: '/points/summary/today'
  }
  return http.post<{ todayPoints: number }>(option)
}

/**
 * 领取积分（MANUAL类型）
 */
export const apiUpdatePoint = (code: string) => {
  const option = {
    url: `/points/record/update`,
    data: { code }
  }
  return http.post<Point>(option)
}

/**
 * 消耗积分（预留商品兑换用）
 */
export const apiPointConsume = (points: number, remark?: string) => {
  const option = {
    url: '/points/record/consume',
    data: { points, remark }
  }
  return http.post(option)
}
