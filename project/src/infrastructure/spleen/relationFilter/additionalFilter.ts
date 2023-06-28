import { SpleenOperatorsEnum } from '../enums/operators.enum'
import {
  ConditionsBuilderFn,
  FilterDataType,
  SpleenBetweenValueType,
} from './additionalFilter.type'
import * as _ from 'lodash'

export const applyAdditionalFilter = (
  where: object,
  cb: ConditionsBuilderFn,
) => {
  return (filter: FilterDataType) => {
    _.merge(where, cb(filter))
  }
}

export const buildRelationQuery = (filter: FilterDataType) => {
  const { field, relation, operator, value } = filter
  switch (operator) {
    case SpleenOperatorsEnum.EQ:
      return getRelationQuery(relation, field, value)

    case SpleenOperatorsEnum.NEQ:
      return getRelationQueryByNeq(relation, field, value)

    case SpleenOperatorsEnum.IN:
      return getRelationQuery(relation, field, { in: value })

    case SpleenOperatorsEnum.NIN:
      return getRelationQuery(relation, field, { not: { in: value } })

    case SpleenOperatorsEnum.BETWEEN:
      const { lower, upper } = value as SpleenBetweenValueType

      return getRelationQuery(relation, field, {
        gte: upper,
        lte: lower,
      })

    default:
      return undefined
  }
}

const getRelationQuery = (relation: string, field: string, value: any) => {
  if (typeof relation === 'string') {
    const obj = {}

    obj[relation] = {
      some: {
        [field]: value,
      },
    }

    if (value === null) obj[relation] = { none: {} }

    return obj
  }
}

const getRelationQueryByNeq = (relation: string, field: string, value: any) => {
  const obj = {}

  obj[relation] = {
    none: {
      [field]: value,
    },
  }

  if (value === null) obj[relation] = { some: {} }

  return obj
}
