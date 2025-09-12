import Http from '@mid-vue/http-client'
import { FetalMovement } from './types'

/**
 * 新增fetalMovement接口
 * @param params 请求参数
 */
export const apiAddFetalMovement = (data: FetalMovement) => {
  return Http.post({
    url: '/centre/fetalMovement/add',
    data
  })
}
