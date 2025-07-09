// 定义健康状态常量
const HEALTH_STATUS = {
  NORMAL: '正常',
  FEVER: '发烧',
  HIGH_FEVER: '高烧',
  ABNORMAL: '体温异常',
  INVALID_AGE: '年龄输入无效'
} as const

// 提取温度范围常量
const TEMPERATURE_RANGES = {
  ZERO_TO_THREE: {
    MIN: 35.8,
    MAX: 37.4
  },
  THREE_TO_THIRTY_SIX: {
    MIN: 35.4,
    MAX: 37.6,
    FEVER_MAX: 38.5
  },
  THIRTY_SIX_AND_ABOVE: {
    MIN: 35.4,
    MAX: 37.7,
    FEVER_MAX: 39.4
  }
} as const

// 通用策略函数
const createTemperatureStrategy = (min: number, max: number, feverMax?: number) => {
  return (temperature: number) => {
    if (temperature >= min && temperature <= max) {
      return HEALTH_STATUS.NORMAL
    } else if (feverMax && temperature > max && temperature <= feverMax) {
      return HEALTH_STATUS.FEVER
    } else if ((feverMax && temperature > feverMax) || temperature > max) {
      return HEALTH_STATUS.HIGH_FEVER
    }
    return HEALTH_STATUS.ABNORMAL
  }
}

// 创建策略
const ZeroToThreeMonthsStrategy = createTemperatureStrategy(
  TEMPERATURE_RANGES.ZERO_TO_THREE.MIN,
  TEMPERATURE_RANGES.ZERO_TO_THREE.MAX
)

const ThreeToThirtySixMonthsStrategy = createTemperatureStrategy(
  TEMPERATURE_RANGES.THREE_TO_THIRTY_SIX.MIN,
  TEMPERATURE_RANGES.THREE_TO_THIRTY_SIX.MAX,
  TEMPERATURE_RANGES.THREE_TO_THIRTY_SIX.FEVER_MAX
)

const ThirtySixMonthsAndAboveStrategy = createTemperatureStrategy(
  TEMPERATURE_RANGES.THIRTY_SIX_AND_ABOVE.MIN,
  TEMPERATURE_RANGES.THIRTY_SIX_AND_ABOVE.MAX,
  TEMPERATURE_RANGES.THIRTY_SIX_AND_ABOVE.FEVER_MAX
)

// 年龄策略映射
const ageStrategyMap = {
  '0-3': ZeroToThreeMonthsStrategy,
  '3-36': ThreeToThirtySixMonthsStrategy,
  '36+': ThirtySixMonthsAndAboveStrategy
}

/**
 * 根据宝宝年龄和体温判断宝宝的健康状态
 * @param age 宝宝年龄，单位：月
 * @param temperature 宝宝体温，单位：摄氏度
 * @returns 宝宝的健康状态，如 '正常'、'发烧'、'高烧'
 */
function checkBabyTemperature(age: number, temperature: number) {
  let strategyKey: keyof typeof ageStrategyMap | null = null
  if (age >= 0 && age < 3) {
    strategyKey = '0-3'
  } else if (age >= 3 && age < 36) {
    strategyKey = '3-36'
  } else if (age >= 36) {
    strategyKey = '36+'
  }

  if (strategyKey) {
    return ageStrategyMap[strategyKey](temperature)
  }
  return HEALTH_STATUS.INVALID_AGE
}

export { checkBabyTemperature, HEALTH_STATUS }
