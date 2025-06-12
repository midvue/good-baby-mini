import { useDate } from '@mid-vue/shared'

import type { ICalendarItem } from '../type'

/**
 * 获取指定日期所在月份的第一天
 * @param date 输入的日期
 * @returns 该月第一天的日期对象
 */
const getStartTime = (date: Date): Date => {
  return useDate(date).startOf('month').toDate()
}

/**
 * 获取指定日期所在月份的最后一天
 * @param date 输入的日期
 * @returns 该月最后一天的日期对象
 */

const getEndTime = (date: Date): Date => {
  return useDate(date).endOf('month').toDate()
}

/**
 * 计算指定日期所在月份的天数
 * @param date 输入的日期
 * @returns 该月的天数
 */
const getDaysInMonth = (date: Date): number => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return new Date(year, month, 0).getDate()
}

/**
 * 创建一个日期对象
 * @param date 日期对象
 * @param day 日期中的日
 * @param isCurrMonth 是否为当前月份
 * @returns 包含日期信息的 ICalendarItem 对象
 */
const createCalendarItem = (date: Date, day: number, isCurrMonth: boolean): ICalendarItem => {
  const currentDate = useDate(date).date(day)
  return {
    day,
    isCurrMonth,
    date: currentDate.toDate()
  }
}

/**
 * 根据输入的日期生成一个包含完整月视图的日历数据
 * @param date 输入的日期
 * @returns 包含 ICalendarItem 对象的数组，代表完整月视图的日历数据
 */
export const useCalendar = (date: Date): ICalendarItem[] => {
  const startOfMonth = getStartTime(date)
  const endOfMonth = getEndTime(date)
  const lastWeekDayOfStartMonth = useDate(startOfMonth).day() || 7
  const daysList: ICalendarItem[] = []

  // 添加上个月需要显示的日期
  for (let i = lastWeekDayOfStartMonth - 1; i > 0; i--) {
    const prevDate = useDate(startOfMonth).subtract(i, 'day')
    daysList.push(createCalendarItem(prevDate.toDate(), prevDate.date(), false))
  }

  // 添加当前月的日期
  const daysInCurrentMonth = getDaysInMonth(date)
  for (let j = 1; j <= daysInCurrentMonth; j++) {
    daysList.push(createCalendarItem(date, j, true))
  }

  // 添加下个月需要显示的日期
  const firstWeekDayOfNextMonth = useDate(endOfMonth).day()
  for (let k = 1; k <= 7 - firstWeekDayOfNextMonth; k++) {
    const nextDate = useDate(endOfMonth).add(k, 'day')
    daysList.push(createCalendarItem(nextDate.toDate(), nextDate.date(), false))
  }

  return daysList
}
