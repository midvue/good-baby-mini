export interface ISerie {
  name: string
  category: string
  data: (number | undefined)[]
  toolTips: {
    show: boolean | ((index: number) => boolean)
    formatter: (params: any) => string
    offset: [number, number]
    color: ''
  }
}
