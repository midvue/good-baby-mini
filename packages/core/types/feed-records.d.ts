import { type EnumFeedType } from '@/dict'
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

  /** 黄疸 */
  interface IJaundice {
    /** 黄疸单位 */
    unit: string
    /** 黄疸值 */
    value: string
    /** 记录时间 */
    feedTime: string
  }

  /** 睡眠 */
  interface ISleep {
    /** 开始时间 */
    feedTime: string
    /** 结束时间 */
    endTime: string
    /** 持续时间 */ å
    duration: number
    /** 睡眠质量 */
    quality: string
    /** 入睡方式 */
    sleepType: string
    /** 睡眠质量 */
    starRating: number
  }

  /** 辅食 */
  interface IFood {
    /** 辅食类型 */
    type: string
    /** 辅食形状 */
    shape: string
    /** 喂养时间 */
    feedTime: string
    /** 食量 */
    foodAmount: number
    /** 食量单位 */
    foodAmountUnit: string
    /** 持续时间 */
    duration: string
    /** 反馈 */
    feedback: string
  }

  interface IDegress {
    /** 喂养时间 */
    feedTime: string
    /** 温度 */
    temperature: string
  }

  /** 喂养记录 */
  interface IFeedRecord<
    T = IMilkBottle | IBreastMilk | IDiaper | IHeightWeight | IJaundice | ISleep | IFood | IDegress
  > {
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
