import { EnumFeedType } from '@/dict'
declare global {
  /** 尿布 */
  interface IDiaper {
    /** 尿布类型 */
    type: string
    /** 臭臭状态  */
    poopType: string
    /** 臭臭颜色  */
    poopColor: string
    /** 喂养时间  */
    feedTime: string
  }

  /** 奶粉 */
  interface IMilk {
    type: string | number
    feedTime: string
    volume: number
  }

  /** 身高体重 */
  interface IHeightWeight {
    /** 记录时间 */
    feedTime: string
    /** 身高 */
    height: number
    /** 体重 */
    weight: number
    /** 头尾 */
    headCircumference: number
    /** 脚长 */
    footLength: number
  }

  /** 喂养记录 */
  interface IFeedRecord<T = IMilk | IDiaper | IHeightWeight> {
    id: number
    /** 宝宝id */
    babyId: number
    feedType: EnumFeedType
    feedTime: string
    content: T
    remark: string | undefined
    createTime?: number
    updateTime?: number
  }
}
export {}
