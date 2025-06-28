export interface ICalendarItem {
  day: number
  isCurrMonth: boolean
  date: Date
  count: number
}

export interface ICListState {
  isExpand: boolean
  backToday: boolean
  current: Date
  list: Array<ICalendarItem> //日历列表
}
