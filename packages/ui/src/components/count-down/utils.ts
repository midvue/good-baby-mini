const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export function padZero(num: number, targetLength: number = 2): string {
  let str = num.toString()

  while (str.length < targetLength) {
    str = '0' + str
  }

  return str
}

export interface TimeData {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export function parseTimeData(time: number): TimeData {
  const days = Math.floor(time / DAY)
  const hours = Math.floor((time % DAY) / HOUR)
  const minutes = Math.floor((time % HOUR) / MINUTE)
  const seconds = Math.floor((time % MINUTE) / SECOND)
  const milliseconds = Math.floor(time % SECOND)

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  }
}

export function parseFormat(format: string, timeData: TimeData): string {
  const { days } = timeData
  let { hours, minutes, seconds, milliseconds } = timeData

  if (format.indexOf('DD') !== -1) {
    format = format.replace('DD', padZero(days))
  } else if (format.indexOf('D') !== -1) {
    format = format.replace('D', days.toString())
  } else {
    hours += days * 24
  }

  if (format.indexOf('HH') !== -1) {
    format = format.replace('HH', padZero(hours))
  } else if (format.indexOf('H') !== -1) {
    format = format.replace('H', hours.toString())
  } else {
    minutes += hours * 60
  }

  if (format.indexOf('mm') !== -1) {
    format = format.replace('mm', padZero(minutes))
  } else if (format.indexOf('m') !== -1) {
    format = format.replace('m', minutes.toString())
  } else {
    seconds += minutes * 60
  }

  if (format.indexOf('ss') !== -1) {
    format = format.replace('ss', padZero(seconds))
  } else if (format.indexOf('s') !== -1) {
    format = format.replace('s', seconds.toString())
  } else {
    milliseconds += seconds * 1000
  }

  if (format.indexOf('S') !== -1) {
    const ms = padZero(milliseconds, 3)

    if (format.indexOf('SSS') !== -1) {
      format = format.replace('SSS', ms)
    } else if (format.indexOf('SS') !== -1) {
      format = format.replace('SS', ms.slice(0, 2))
    } else {
      format = format.replace('S', ms.charAt(0))
    }
  }

  return format
}

export function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000)
}
