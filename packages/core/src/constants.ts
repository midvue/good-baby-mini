/** 订单创建数据的存储key */
export const ORDER_FORM_STORE_KEY = 'mid-vue-order-form-data'
// 默认显示文案
export const DEFAULT_TEXT = '--'

/** ocr识别图片存储的key */
export const OCR_ADDRESS_KEY = 'mid-vue-ocr-address'

/** 事件的key */
export const EVENT_CHANNEL_KEYS = {
  /** 地址信息 */
  GET_ADDRESS_INFO: 'getAddressInfo',
  /** 地址详情 */
  GET_ADDRESS_DETAIL: 'getAddressDetail',
  /** 地址表单数据 */
  ACCEPT_DATA_FORM: 'acceptDataForm'
} as const
