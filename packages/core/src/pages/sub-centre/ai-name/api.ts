import Http from '@mid-vue/http-client'
import { type IAiNameReq, type IAiNameResponse } from './types'

/**
 * AI 取名接口
 * @param params 请求参数
 */
export const apiGetAINames = (params: IAiNameReq) => {
  return Http.post<IAiNameResponse>({
    url: '/api/ai-naming',
    method: 'POST',
    data: params
  })
}
