import Http from '@allkit/http-client'
import { type FetalMovement } from '../../types'

/**
 * 宫缩记录接口
 * @param params 请求参数
 */
export const apiGetFetalRecords = (data = {}) => {
  return Http.post<FetalMovement[]>({
    url: '/centre/fetalMovement/list',
    data
  })
}
