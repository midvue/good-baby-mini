export type TAreaType = 'provinceArr' | 'cityArr' | 'areaArr'

export type TAreaColumn = { label: string; value: string }

export type TAreaState = Record<TAreaType, Array<TAreaColumn>>

export type TAreaParams = Record<'province' | 'city' | 'area', TAreaColumn>
