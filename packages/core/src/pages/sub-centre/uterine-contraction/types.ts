/**
 * 宫缩记录
 */
export interface UterineContraction {
  id?: number
  startTime: string
  endTime: string
  duration: number
  interval: number
}

export interface UterineContractionState {
  form: UterineContraction
  list: UterineContraction[]
}
