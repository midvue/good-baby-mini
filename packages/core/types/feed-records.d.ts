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

  /** 奶瓶喂养 */
  interface IMilkBottle {
    type: string | number
    feedTime: string
    volume: number
  }

  /** 母乳亲喂 */
  interface IBreastMilk {
    type: string | number
    /** 持续时间 */
    duration: number
    leftDuration: number
    rightDuration: number
    feedTime: string
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
    headCircumference: number | undefined
    /** 脚长 */
    footLength: number | undefined
  }

  /** 喂养记录 */
  interface IFeedRecord<T = IMilkBottle | IBreastMilk | IDiaper | IHeightWeight> {
    id: number
    /** 宝宝id */
    babyId: number
    feedType: EnumFeedType
    feedTime: string
    feedTimeStr: string | undefined
    content: T
    remark: string | undefined
    createTime?: number
    updateTime?: number
  }
}
export {}
