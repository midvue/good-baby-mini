import Http from '@mid-vue/http-client'
import { IAiNameReq, INameResponse } from './types'

/**
 * 智能 取名接口
 * @param params 请求参数
 */
export const apiGetAINames = (data: IAiNameReq) => {
  return Http.post<INameResponse[][]>({
    url: '/ai/names',
    data
  })
}
