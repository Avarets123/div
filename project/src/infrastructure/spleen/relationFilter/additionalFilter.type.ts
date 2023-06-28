export type SpleenBetweenValueType = { lower: any; upper: any }

export type FilterDataType = {
  relation: string
  field: string
  value: string | SpleenBetweenValueType
  operator: string
}

export type AdditionalFilterType = Pick<
  FilterDataType,
  'field' | 'relation'
> & {
  filterName: string
  availableOperators: string[]
}

export type ConditionsBuilderFn = (filter: FilterDataType) => any
