import Http from '@mid-vue/http-client'
import { type IAiNameReq, type IAiNameResponse } from './types'

/**
 * AI 取名接口
 * @param params 请求参数
 */
export const apiGetAINames = (data: IAiNameReq) => {
  return Http.post<IAiNameResponse[][]>({
    url: '/ai/names',
    data
  })
}
