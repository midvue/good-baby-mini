import { useDate } from '@allkit/shared'
import {
  headCircumferenceAgeMonths,
  heightWeightAgeMonths
} from '../data'
import { type GrowthAxisData } from '../types'

const isEmptyHeightWeightValue = (value: string | number | null | undefined) =>
  value === '' || value === null || value === undefined

export const findNearestAgeIndex = (ageRows: number[], month: number) => {
  let nearestIndex = 0
  let nearestDistance = Number.POSITIVE_INFINITY

  // Standard growth data is sampled by age rows, so map the record month to the nearest row.
  ageRows.forEach((ageMonth, index) => {
    const distance = Math.abs(ageMonth - month)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = index
    }
  })

  return nearestIndex
}

export const getDisplayEndIndex = (ageRows: number[], month: number) => {
  // Keep the visible range bounded by the standard data while still showing a little future context.
  const cappedMonth = Math.min(Math.max(month, 0), ageRows[ageRows.length - 1])
  for (let index = ageRows.length - 1; index >= 0; index--) {
    if (ageRows[index] <= cappedMonth) return index
  }
  return 0
}

export const getRoundedAgeMonth = (feedTime: string, birthDate: string) => {
  const feedDate = useDate(feedTime)
  let month = feedDate.diff(useDate(birthDate), 'month')
  const sameMonthTargetDate = useDate(birthDate).add(month, 'month')
  const diffDays = feedDate.diff(sameMonthTargetDate, 'day')

  // Measurements after the middle of a month are plotted on the next month tick.
  if (diffDays > 15) {
    month += 1
  }

  return month
}

export const createGrowthAxisData = (
  feedRecordList: IFeedRecord<IHeightWeight>[],
  birthDate: string
): GrowthAxisData => {
  return feedRecordList.reduce<GrowthAxisData>(
    (axis, feedRecord) => {
      const month = getRoundedAgeMonth(feedRecord.feedTime, birthDate)
      const heightWeightIndex = findNearestAgeIndex(heightWeightAgeMonths, month)
      const headCircumferenceIndex = findNearestAgeIndex(headCircumferenceAgeMonths, month)
      const { content } = feedRecord

      if (!isEmptyHeightWeightValue(content.height)) {
        axis.heightArr[heightWeightIndex] = Number(content.height)
      }
      if (!isEmptyHeightWeightValue(content.weight)) {
        axis.weightArr[heightWeightIndex] = Number(content.weight)
      }
      if (!isEmptyHeightWeightValue(content.headCircumference)) {
        axis.headCircumferenceArr[headCircumferenceIndex] = Number(content.headCircumference)
      }

      return axis
    },
    {
      heightArr: new Array(heightWeightAgeMonths.length).fill(undefined),
      weightArr: new Array(heightWeightAgeMonths.length).fill(undefined),
      headCircumferenceArr: new Array(headCircumferenceAgeMonths.length).fill(undefined)
    }
  )
}
