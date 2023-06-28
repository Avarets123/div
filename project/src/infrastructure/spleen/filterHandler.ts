import { SpleenParser } from './spleen-parser'
import * as _ from 'lodash'
import { AdditionalFilterType } from './relationFilter/additionalFilter.type'

export class SpleenHandler {
  private fields = new Map<string, string[]>()
  private filtersName = new Map<string, string>()
  private spleenParser = new SpleenParser()
  private where = {}

  private replaceForFilterName(input: string) {
    let newInput = input
    this.filtersName.forEach((v, k) => {
      newInput = newInput.replaceAll(v, k)
    })

    return newInput
  }

  public build(input: string) {
    const newInput = this.replaceForFilterName(input)

    const availablefields = [...this.fields].map((el) => el[0])

    this.where = this.spleenParser.build(newInput, availablefields)

    return this.where
  }

  public bind(where: unknown) {
    return _.merge(where, this.where)
  }

  public transformToShow(additionalFilters?: AdditionalFilterType[]) {
    let res = [...this.fields]

    if (additionalFilters?.length) {
      res = res.concat(
        additionalFilters.map(({ availableOperators, filterName }) => [
          filterName,
          availableOperators,
        ]),
      )
    }

    return res.map(
      ([
        name,
        operators,
      ]) => ({
        name: this.filtersName.get(name) ?? name,
        operators,
      }),
    )
  }
}

export const filteringAndMaping = <T, V>(
  targetArray: T[],
  filter: (item: T) => boolean,
  mapper: (item: T) => V,
): V[] => {
  return targetArray.filter(filter).map(mapper)
}
