/**
 * AI 取名请求参数
 */
export interface IAiNameReq {
  isBorn: string
  lastName: string
  gender: string
  birthDate: string
  birthTime: string
}

/**
 * AI 取名响应结果
 */
export interface IAiNameResponse {
  names: string[]
  reason?: string[]
}

export interface AiNameState {
  form: IAiNameReq
}
