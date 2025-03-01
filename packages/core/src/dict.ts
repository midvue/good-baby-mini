/** 页面类型 */
export enum EnumEnvVersion {
  /** stg环境 */
  STG = 'stg',
  /** uat 环境 (开发版,体验版默认uat) */
  UAT = 'uat',
  /** uat 环境 (开发版,体验版默认uat) */
  UAT_OPTION = 'uat_option',
  /** 生产环境 */
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

/** 主题类型 */
export enum EnumThemeType {
  /** 默认 */
  DEFAULT = 'defaultTheme',
  /** 春节 */
  SPRING = 'Spring'
}

/** 主题的背景图 */
export const EnumThemeTypeMap = {
  [EnumThemeType.DEFAULT]: {
    name: 'defaultTheme',
    homeBG: 'order/bg-home-head-min-3.png',
    homeBackgroundColor: '#8365f6',
    homeCreateBtn: '#8365f6',
    listBG: 'order/bg-list-head.png',
    mineBG: 'mine/bg-top-bar.png',
    avatarBG: 'mine/bg-mine-VIP.png'
  },
  [EnumThemeType.SPRING]: {
    name: 'spring',
    homeBG: 'order/icon-bg-home-head-x3-min-2025.png',
    homeBackgroundColor: '#DE3D35',
    homeCreateBtn: '#FF4747',
    listBG: 'order/bg-list-head-2025.png',
    mineBG: 'mine/bg-mine-head-2025.png',
    avatarBG: 'mine/bg-mine-avatar-2025-2.png'
  }
}

// 主题配置
export const themeConfig = EnumThemeTypeMap[EnumThemeType.DEFAULT]

/** 订单状态 */
export enum EnumOrderStatus {
  /** 商务报价中(未报价)-100 */
  NO_QUOTATION = '100',
  /** 待下单(已报价)-200 */
  QUOTED = '200',
  /** 已下单-300 */
  ORDERED = '300',
  /** 已中标-400 */
  SCHEDULED = '400',
  /** 进行中-500 */
  UNDERWAY = '500',
  /** 已完成(已签收)-600 */
  SIGNED = '600',
  /** 已取消-700 */
  CANCELED = '700'
}

/** 业务类型 */
export enum EnumBusinessTypeStatus {
  ENTERPRISE_VEHICLE = '10',
  /** 企业整车(危) */
  ENTERPRISE_VEHICLE_RISK = '11',
  /** 普通整车 */
  ORDINARY_VEHICLE = '20',
  /** 同城配送 */
  SAME_CITY_DELIVERY = '30'
}

/**  businessType 业务类型(250企业整车, 270企业整车(危)), 240普通整车  */
export const EnumCrmBusinessType = {
  /** 普通整车 */
  FTL: 240,
  /** 企业整车 */
  E_FTL: 250,
  /** 企业整车(危) */
  E_FTL_D: 270
}

export const businessTypeStatusMap = {
  [EnumBusinessTypeStatus.ENTERPRISE_VEHICLE]: {
    label: '企业整车'
  },
  [EnumBusinessTypeStatus.ENTERPRISE_VEHICLE_RISK]: {
    label: '企业整车(危)'
  },
  [EnumBusinessTypeStatus.ORDINARY_VEHICLE]: {
    label: '普通整车'
  },
  [EnumBusinessTypeStatus.SAME_CITY_DELIVERY]: {
    label: '同城配送'
  }
} as const

/** 报价状态 */
export enum EnumQuotationStatus {
  /** 预报价-100 */
  FORECAST = '100',
  /** 报价待确认-101 */
  QUOTATION_CONFIRM = '101',
  /** 已报价-200 */
  QUOTED = '200',
  /** 已中标-300 */
  SCHEDULED = '300',
  /** 未中标-400 */
  UNDERWAY = '400',
  /** 已取消-500 */
  CANCELED = '500'
}

/** 地址类型 */
export const EnumLocationTypeCode = {
  /** 始发地-1 */
  START: '1',
  /** 经停地-2 */
  STOP: '2',
  /** 目的地-3 */
  END: '3'
} as const

/**  地址 经停类型 */
export enum EnumLocationPointTypeCode {
  /** 装货经停 */
  LOAD_STOP = '10',
  /** 卸货经停 */
  UNLOAD_STOP = '20'
}

/** 回单类型 */
export const EnumReceiptType = {
  /**回单原件 */
  ORIGINAL: '10',
  /**回单照片 */
  PHOTO: '20',
  /**无需回单 */
  NONE: '30',
  /**电子回单 */
  ELECTRONIC: '40'
}

/** 询价渠道 mid-vue_common_channel_type */
export enum EnumChannelType {
  /** ERP */
  ERP = '1',
  /** 跨越速运APP */
  dee_TRANSPORT = '2',
  /** 跨声 */
  KS = '3',
  /** 废弃渠道(微信) */
  WE_CHAT_ABANDON = '4',
  /** API对接 */
  API = '5',
  /** 网络货运 */
  ONLINE_TRANSPORT = '6',
  /** 跨越整车小程序*/
  WE_CHAT = '7',
  /** 跨越速运官网 */
  dee_WEBSITE = '8'
}

/** 100整车 200 干线 300 取派 400：包车 500：直达 */
export enum EnumTaskType {
  /** 100整车 */
  FULL_TRUCK = '100',
  /** 200 干线 */
  CONNECTOR = '200',
  /** 300 取派 */
  PICKUP = '300',
  /** 400：包车 */
  BATCH = '400',
  /** 500：直达 */
  DIRECT = '500'
}

/**  特殊货物标签 ''没有选择  0不含电池  1含电池 2,"危险品新电池 3, 危险品旧电池 */
export enum EnumSpecialGoodsLabel {
  /** 不含电池 */
  NO_BATTERY = '0',
  /** 含电池 */
  HAS_BATTERY = '1',
  /** 危险品新电池 */
  NEW_BATTERY = '2',
  /** 危险品旧电池 */
  OLD_BATTERY = '3'
}

/** 是否需要用户选择含电池*/
export enum EnumCargoBatteryFlag {
  /** 无需选择  */
  NO_SELECT = '0',
  /** 需选择是否含电池 */
  BATTERY = '1',
  /** 需选择是否含酒精 */
  ALCOHOL = '2'
}

/** 列表页tab状态 */
export enum EnumTabStatus {
  /** 询价中 */
  WAIT_INQUIRY = 'waitInquiry',
  /** 进行中 */
  DEALING = 'dealing',
  /** 已完成 */
  FINISHED = 'finished',
  /** 已取消 */
  CANCELLED = 'cancelled'
}

/** 订单子状态 */
export enum EnumOrderSubStatus {
  /** 待派车(待分配)-10 */
  WAIT_ALLOCATED = '10',
  /** 已派车(待执行)-20 */
  WAIT_EXECUTION = '20',
  /** 服务中(取货中)-30 */
  DURING_PICK_UP = '30',
  /** 服务中(运输中)-40 */
  IN_TRANSIT = '40'
}

export const orderSubStatusKeyMap = {
  /** 已下单 */
  [EnumOrderStatus.ORDERED]: 'order',
  /** 待派车(待分配)-10 */
  [EnumOrderSubStatus.WAIT_ALLOCATED]: 'waitAllocated',
  /** 已派车(待执行)-20 */
  [EnumOrderSubStatus.WAIT_EXECUTION]: 'waitExecution',
  /** 服务中(取货中)-30 */
  [EnumOrderSubStatus.DURING_PICK_UP]: 'duringPickUP',
  /** 服务中(运输中)-40 */
  [EnumOrderSubStatus.IN_TRANSIT]: 'inTransit',
  /** 待签收-sign_in */
  [EnumOrderStatus.SIGNED]: 'signIn'
}

/** 取消原因 mid-vue_common_cancel_type */
export enum EnumCancelType {
  /** 暂时不发-300 */
  NOT_RELEASED = '300',
  /** 价格过高-100 */
  PRICES_HIGH = '100',
  /** 报价不及时-1600 */
  TIMEOUT_CANCEL = '1600',
  /** 其他原因-800 */
  OTHER_REASON = '800',
  /** 已发其他物流 */
  OTHER_LOGISTICS_SENT = '3200',
  /** 已重新下单 */
  REORDERED = '200'
}

export const cancelTypeKeyMap = {
  /** 暂时不发-300 */
  [EnumCancelType.NOT_RELEASED]: 'notReleased',
  /** 报价不及时-1100 */
  [EnumCancelType.TIMEOUT_CANCEL]: 'timeoutCancel',
  /** 其他原因-800 */
  [EnumCancelType.OTHER_REASON]: 'otherReason'
}

/** 询价中订单子状态 */
export const waitInquirySubStatusMap = {
  [EnumOrderStatus.NO_QUOTATION]: '商务报价中',
  [EnumOrderStatus.QUOTED]: '待下单'
} as Record<EnumOrderStatus, string>

/** 进行中订单子状态 */
export const dealingSubStatusMap = {
  [EnumOrderStatus.ORDERED]: '待派车',
  [EnumOrderSubStatus.WAIT_ALLOCATED]: '待派车',
  [EnumOrderSubStatus.WAIT_EXECUTION]: '已派车',
  [EnumOrderSubStatus.DURING_PICK_UP]: '服务中',
  [EnumOrderSubStatus.IN_TRANSIT]: '服务中',
  [EnumOrderStatus.SIGNED]: '待签收'
}

/** 已完成订单子状态 */
export const finishedSubStatusMap = {
  [EnumOrderStatus.SIGNED]: '已完成'
}

/** 已取消订单子状态 */
export const cancelledSubStatusMap = {
  [EnumCancelType.NOT_RELEASED]: '暂不发货',
  [EnumCancelType.TIMEOUT_CANCEL]: '报价不及时',
  [EnumCancelType.OTHER_REASON]: '其他原因'
} as Record<EnumCancelType, string>

export enum EnumInsureWorkOrderStatus {
  /** 创建失败 */
  fail = '99',
  /** 待审核 */
  waitReview = '100',
  /** 已驳回 */
  reject = '200',
  /** 已通过 */
  success = '300',
  /** 取消投保 */
  cancel = '400',
  /** 退保失败 */
  returnFail = '500',
  /** 已退保 */
  returnSuccess = '600',
  /** 投保失败 */
  insureFail = '700',
  /** 已投保 */
  insured = '800'
}

/** 取消状态 */
export enum EnumCancelStatus {
  NO = '0',
  /** 未报价 */
  NOT_QUOTE = '100'
}

/** 列表加载状态 */
export enum EnumLoadingType {
  /**下拉刷新 */
  REFRESH = 'refresh',
  /** Tab切换 */
  TAB_CHANGE = 'tabChange',
  /** 统计tag切换 */
  TAG_CHANGE = 'tagChange',
  /** 上划加载 */
  LOAD_MORE = 'loadMore'
}

/** 告诉司机数据字典 mid-vue_order_inquiry_create_driverserver */
export enum EnumDriverServiceType {
  /** 需压车 */
  DELIVERY_NEEDED = 99,
  /** 送货上楼 */
  DELIVERY_UPSTAIRS = 101,
  /** 需入仓 */
  WAREHOUSING = 102,
  /** 需报关 */
  DECLARE = 103,
  /** 代垫付款 */
  ADVANCE_MONEY = 104,
  /** 需双驾 */
  TOW_DRIVER = 100,
  /** 全程高速 */
  EXPRESSWAY = 200,
  /** 承运人装货 */
  OUTSIDE_LOAD = 300,
  /** 承运人卸货 */
  OUTSIDE_UNLOAD = 400,
  /** 超限 */
  GOODS_OVER = 98
}
export const packageTypeList = [
  { label: '托盘', value: '14', ext: '{"show": 1}', displaySequence: 1 },
  { label: '纸箱', value: '18', ext: '{"show": 1}', displaySequence: 2 },
  { label: '木箱', value: '9', ext: '{"show": 0}', displaySequence: 3 },
  { label: '裸装', value: '8', ext: '{"show": 1}', displaySequence: 4 },
  { label: '散装', value: '11', ext: '{"show": 1}', displaySequence: 5 },
  { label: '筐装', value: '5', ext: '{"show": 1}', displaySequence: 6 },
  { label: '吨包', value: '2', ext: '{"show": 0}', displaySequence: 7 },
  { label: '罐装', value: '3', ext: '{"show": 0}', displaySequence: 8 },
  { label: '其他', value: '20', ext: '{"show": 2}', displaySequence: 9 },
  { label: '袋装', value: '1', ext: '{"show": 1}', displaySequence: 10 },
  { label: '泡沫箱', value: '10', ext: '{"show": 0}', displaySequence: 10 },
  { label: '架子', value: '4', ext: '{"show": 0}', displaySequence: 11 },
  { label: '水箱', value: '12', ext: '{"show": 0}', displaySequence: 12 },
  { label: '捆扎', value: '6', ext: '{"show": 1}', displaySequence: 12 },
  { label: '桶装', value: '13', ext: '{"show": 0}', displaySequence: 13 },
  { label: '笼装', value: '7', ext: '{"show": 0}', displaySequence: 13 },
  { label: '网兜', value: '15', ext: '{"show": 0}', displaySequence: 15 },
  { label: '线盘', value: '16', ext: '{"show": 0}', displaySequence: 16 },
  { label: '压块', value: '17', ext: '{"show": 0}', displaySequence: 17 },
  { label: '周转箱', value: '19', ext: '{"show": 0}', displaySequence: 19 }
]

/** 敏感词文本校验类型 */
export enum EnumSensitiveWordTextType {
  /** 寄件人 */
  SENDER = 10,
  /** 收件人 */
  RECIPIENT = 11,
  /** 托寄物 */
  PARCEL = 12,
  /** 地址 */
  ADDRESS = 13,
  /** 备注 */
  REMARK = 14,
  /** 公司名称 */
  COMPANY_NAME = 15,
  /** 接收人 */
  RECEIVER = 16,
  /** 备注 */
  NOTES = 17
}

// 定义订单路由节点状态枚举对应（mid-vue_order_route_node_type）
export enum EnumRouteNode {
  /** 确认下单 */
  CONFIRM_ORDER = 2
}

/** 用户结算类型
 * 10-现结，20-周结，30-半月结，40-月结
 */
export enum EnumPayMode {
  /** 10: 现结 */
  CASH_SETTLEMENT = '10',
  /** 20: 周结 */
  WEEKLY_SETTLEMENT = '20',
  /** 30: 半月结 */
  FORTNIGHTLY_SETTLEMENT = '30',
  /** 40: 月结 */
  MONTHLY_SETTLEMENT = '40'
}
