/** 环境版本 */
export enum EnumEnvVersion {
  /** 开发/测试环境 (小程序开发版/体验版默认) */
  DEV = 'dev',
  /** 生产环境 (小程序正式版) */
  RELEASE = 'release'
}

/** 页面类型 */
export enum EnumPageType {
  /**列表 */
  LIST = '10',
  /** 详情页 */
  DETAIL = '20'
}

/** 事件类型 */
export enum EnumEventType {
  /**刷新页面 */
  REFRESH = 'Refresh'
}

/** 喂养类型 */
export enum EnumFeedType {
  /**奶瓶喂养 */
  MILK_BOTTLE = 10,
  /** 母乳亲喂 */
  BREAST_FEED_DIRECT = 20,
  /** 尿布 */
  DIAPER = 30,
  /** 身高体重 */
  HEIGHT_WEIGHT = 40,
  /** 黄疸 */
  JAUNDICE = 50,
  /** 睡眠 */
  SLEEP = 60,
  /** 辅食 */
  FOOD = 70,
  /** 体温 */
  DEGRESS = 80,
  /** 补剂 */
  SUPPLEMENT = 90,
  /** 疫苗 */
  VACCINE = 100,
  /** 用药 */
  MEDICINE = 110
}