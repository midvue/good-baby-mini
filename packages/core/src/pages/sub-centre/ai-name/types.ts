/**
 * AI 取名请求参数
 */
export interface IAiNameReq {
  isBorn: string
  surname: string
  gender: string
  birthDate?: string
  birthTime?: string
  remark?: string
}

/**
 * AI 取名响应结果
 */
export interface IAiNameResponse {
  name: string
  desc: string
}

export interface AiNameState {
  form: IAiNameReq
}
