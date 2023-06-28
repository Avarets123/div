import { SpleenParser } from './spleen-parser'
import * as _ from 'lodash'

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

  public build(input: string, fields: string[]) {
    const newInput = this.replaceForFilterName(input)

    this.where = this.spleenParser.build(newInput, fields)

    return this.where
  }

  public bind(where: unknown) {
    return _.merge(where, this.where)
  }

  public transformToShow() {
    let res = [...this.fields]

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
