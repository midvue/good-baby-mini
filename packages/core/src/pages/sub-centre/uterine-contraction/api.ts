import Http from '@allkit/http-client'
import { type UterineContraction } from './types'

/**
 * 宫缩记录接口
 * @param params 请求参数
 */
export const apiGetUterineRecords = (data = {}) => {
  return Http.post<UterineContraction[]>({
    url: '/centre/uterineRecord/list',
    data
  })
}
/**
 * 新增uterineRecord接口
 * @param params 请求参数
 */
export const apiAddUterineRecord = (data: UterineContraction) => {
  return Http.post({
    url: '/centre/uterineRecord/add',
    data
  })
}
/**
 * 删除uterineRecord接口
 * @param params 请求参数
 */
export const apiDeleteUterineRecord = (data: { ids: number[] }) => {
  return Http.post({
    url: '/centre/uterineRecord/delete/batch',
    data
  })
}
