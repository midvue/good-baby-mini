export interface AutoCompleteOption<T = Record<string, any>> {
  label: string
  richLabel: string
  data: T
}

export type AutoCompleteScoped<T = Record<string, any>> = {
  option: { item: AutoCompleteOption<T>; index: number }
}
