import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import * as _ from 'lodash'
import { ListingDto, SortItemDto } from '@infrastructure/common/pagination/dto'
import { SpleenHandler } from '@infrastructure/spleen/filterHandler'

@Injectable()
export class RepositoryProvider {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(tableName: string, model: any, params: ListingDto) {
    const allFields = (await this.prisma.getTableFields(tableName)).map(
      (el) => el.column_name,
    )

    const { filter } = this.applySpleen(params.filter, allFields)

    let where: any = {
      AND: {
        OR: await this.applySearch(params.query, tableName),
        ...filter,
      },
    }

    if (allFields.find((f) => f === 'deletedAt')) {
      where = {
        AND: {
          ...where,
          deletedAt: where.deletedAt ?? null,
        },
      }
    }

    const { skip, take } = this.countResponseItems(params)

    const records = model.findMany({
      where,
      orderBy: this.applyOrdering(params.sort),
      skip,
      take,
    })

    const recordsCount = model.count({
      where,
    })

    const [
      data,
      total,
    ] = await Promise.all([
      records,
      recordsCount,
    ])

    return {
      limit: params.limit,
      page: params.page,
      total: Number(total),
      data: data,
      $aggregations: {},
    }
  }

  applyOrdering(sort: SortItemDto[]) {
    return sort?.length
      ? sort.map((item) => ({ [item.field]: item.direction }))
      : ([{ created_at: 'desc' }] as unknown)
  }

  async softDelete(model: any, where: any) {
    await model.updateMany({
      where: {
        ...where,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    })
  }

  private countResponseItems(params: ListingDto) {
    const { limit, page } = params

    const res = {
      skip: undefined,
      take: undefined,
    }

    if (limit === 0 || (!limit && !page)) {
      return res
    }

    res.skip = (page - 1) * limit
    res.take = limit

    return res
  }

  applySpleen(input: string, fields: string[]) {
    const filterHandler = new SpleenHandler()

    const filter = input ? filterHandler.build(input, fields) : undefined

    return {
      filter,
    }
  }

  private async applySearch(search: string, tableName: string) {
    if (!search) return []

    const strFields = await this.prisma.getTableFieldsByType(tableName, 'text')
    return strFields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' },
    }))
  }
}
