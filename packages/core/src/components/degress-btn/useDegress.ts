// 定义健康状态常量
const HEALTH_STATUS = {
  NORMAL: '正常',
  FEVER: '发烧',
  HIGH_FEVER: '高烧',
  ABNORMAL: '体温异常',
  INVALID_AGE: '年龄输入无效'
} as const

// 定义策略接口
interface TemperatureStrategy {
  check(temperature: number): (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS]
}

// 0 - 3 个月的策略
class ZeroToThreeMonthsStrategy implements TemperatureStrategy {
  check(temperature: number): (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS] {
    if (temperature >= 35.8 && temperature <= 37.4) {
      return HEALTH_STATUS.NORMAL
    } else if (temperature > 37.4) {
      return HEALTH_STATUS.HIGH_FEVER
    }
    return HEALTH_STATUS.ABNORMAL
  }
}

// 3 - 36 个月的策略
class ThreeToThirtySixMonthsStrategy implements TemperatureStrategy {
  check(temperature: number): (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS] {
    if (temperature >= 35.4 && temperature <= 37.6) {
      return HEALTH_STATUS.NORMAL
    } else if (temperature > 37.6 && temperature <= 38.5) {
      return HEALTH_STATUS.FEVER
    } else if (temperature > 38.5) {
      return HEALTH_STATUS.HIGH_FEVER
    }
    return HEALTH_STATUS.ABNORMAL
  }
}

// 36 个月以上的策略
class ThirtySixMonthsAndAboveStrategy implements TemperatureStrategy {
  check(temperature: number): (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS] {
    if (temperature >= 35.4 && temperature <= 37.7) {
      return HEALTH_STATUS.NORMAL
    } else if (temperature > 37.7 && temperature <= 39.4) {
      return HEALTH_STATUS.FEVER
    } else if (temperature > 39.4) {
      return HEALTH_STATUS.HIGH_FEVER
    }
    return HEALTH_STATUS.ABNORMAL
  }
}

/**
 * 根据宝宝年龄和体温判断宝宝的健康状态
 * @param age 宝宝年龄，单位：月
 * @param temperature 宝宝体温，单位：摄氏度
 * @returns 宝宝的健康状态，如 '正常'、'发烧'、'高烧'
 */
function checkBabyTemperature(
  age: number,
  temperature: number
): (typeof HEALTH_STATUS)[keyof typeof HEALTH_STATUS] {
  let strategy: TemperatureStrategy

  if (age >= 0 && age < 3) {
    strategy = new ZeroToThreeMonthsStrategy()
  } else if (age >= 3 && age < 36) {
    strategy = new ThreeToThirtySixMonthsStrategy()
  } else if (age >= 36) {
    strategy = new ThirtySixMonthsAndAboveStrategy()
  } else {
    return HEALTH_STATUS.INVALID_AGE
  }

  return strategy.check(temperature)
}

export { checkBabyTemperature, HEALTH_STATUS }
