import { PrismaService } from '@infrastructure/database/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { RequestCreateDto } from '../dto/requestCreate.dto'
import { RequestUpdateDto } from '../dto/requestUpdate.dto'
import { ListingDto } from '@infrastructure/common/pagination/dto'
import { RepositoryProvider } from '@infrastructure/database/repository.provider'
import { Prisma, RequestStatusEnum } from '@prisma/client'

@Injectable()
export class RequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: RepositoryProvider,
  ) {}

  createRequest(data: RequestCreateDto) {
    return this.prisma.request.create({
      data,
    })
  }

  updateRequest(id: string, data: RequestUpdateDto) {
    const { comment } = data

    const status = RequestStatusEnum.Resolved

    return this.prisma.request.update({
      where: {
        id,
      },
      data: {
        comment,
        status,
      },
    })
  }

  findRequests(listing: ListingDto) {
    return this.repository.findMany(
      Prisma.ModelName.Request,
      this.prisma.request,
      listing,
    )
  }
}
