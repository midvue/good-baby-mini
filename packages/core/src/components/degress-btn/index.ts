import { useDate } from '@mid-vue/shared'
import DegressBtn from './DegressBtn.vue'

/**
 * 根据宝宝的出生日期计算宝宝的月龄
 * @param birthDate 宝宝的出生日期，格式如 "2024-12-17T16:00:00.000Z"
 * @returns 宝宝的月龄
 */
function calculateBabyMonths(birthDate: string): number {
  const birth = useDate(birthDate)
  const now = useDate()
  return now.diff(birth, 'month')
}

export { DegressBtn, calculateBabyMonths }
