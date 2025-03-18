export interface IFeedMilkState {
  id: number | undefined
  babyId: number
  feedType: number
  remark: string | undefined
  form: IDiaper
}

/** 喂养类型 */
export enum EnumDiaperType {
  /** 臭臭 */
  POOP = '10',
  /** 尿布 */
  PEE = '20',
  /** 臭臭+嘘嘘 */
  BOTH = 30
}
