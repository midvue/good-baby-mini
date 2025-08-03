/**
 * AI 取名请求参数
 */
export interface UterineContractionReq {
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
export interface UterineContractionResponse {
  name: string
  desc: string
}

export interface UterineContractionState {
  form: UterineContractionReq
}
