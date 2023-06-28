import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Global,
} from '@nestjs/common'
import { EntityTypeEnum, LogActionsEnum } from '@prisma/client'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { PrismaService } from '../database/prisma.service'

interface LogCreateInput {
  entityType: EntityTypeEnum
  action: LogActionsEnum
  idParamName?: string
}

@Global()
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly prisma = new PrismaService()
  private readonly data: LogCreateInput
  constructor(data: LogCreateInput) {
    this.data = data
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const startTime = Date.now()
    const req = context.switchToHttp().getRequest()
    const {
      method,
      url,
      originalUrl,
      query,
      body,
      headers,
      params,
      connection: { remoteAddress, remotePort },
      route: { path },
      res: { statusCode },
    } = req
    // перенести часть кода в logging.service.ts
    const user = req.user

    const modelMapping = {
      [EntityTypeEnum.User]: this.prisma.user,
      [EntityTypeEnum.Shop]: this.prisma.shop,
      [EntityTypeEnum.ShopSetting]: this.prisma.shopSetting,
      [EntityTypeEnum.Category]: this.prisma.categories,
      [EntityTypeEnum.Product]: this.prisma.products,
      [EntityTypeEnum.Service]: this.prisma.services,
      // [EntityTypeEnum.Order]: this.prisma.orders,
    }

    let dataBefore: Record<string, any>
    let dataAfter: Record<string, any>

    if (this.data.action !== 'create') {
      dataBefore = await modelMapping[this.data.entityType].findUnique({
        where: {
          id: this.data.idParamName ? params[this.data.idParamName] : params.id,
        },
      })

      toNumberUserIdInt(dataBefore, this.data.entityType)
    }

    const log = await this.prisma.platformLog.create({
      data: {
        userId: user?.id ?? null,
        entityType: this.data.entityType,
        entityId: this.data.idParamName
          ? params[this.data.idParamName]
          : params.id,
        action: this.data.action,
        request: {
          method,
          url,
          originalUrl,
          query,
          body,
          headers,
          params,
          connection: {
            remoteAddress,
            remotePort,
          },
          route: {
            path,
          },
        },
        response: {
          statusCode,
        },
        dataBefore,
      },
      select: {
        id: true,
      },
    })

    return next.handle().pipe(
      tap(async (value) => {
        const responseTime = Date.now() - startTime
        if (this.data.action !== 'create') {
          dataAfter = await modelMapping[this.data.entityType].findUnique({
            where: {
              id: this.data.idParamName
                ? params[this.data.idParamName]
                : params.id,
            },
          })
        } else {
          dataAfter = await modelMapping[this.data.entityType].findUnique({
            where: { id: value },
          })
        }

        toNumberUserIdInt(dataAfter, this.data.entityType)

        await this.prisma.platformLog.update({
          where: {
            id: log.id,
          },
          data: {
            dataAfter,
            response: {
              statusCode,
              responseTime,
            },
          },
        })
      }),
    )
  }
}

const toNumberUserIdInt = (
  data: Record<string, any>,
  entityType: EntityTypeEnum,
) => {
  if (entityType === EntityTypeEnum.User) {
    const { idInt } = data

    data.idInt = Number(idInt)
  }
}
