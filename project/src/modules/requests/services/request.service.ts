import { PrismaService } from '@infrastructure/database/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { RequestCreateDto } from '../dto/requestCreate.dto'
import { RequestUpdateDto } from '../dto/requestUpdate.dto'
import { ListingDto } from '@infrastructure/common/pagination/dto'
import { RepositoryProvider } from '@infrastructure/database/repository.provider'
import { Prisma, RequestStatusEnum } from '@prisma/client'
import { EmailService } from '@infrastructure/emailer/service/emailer.service'

@Injectable()
export class RequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: RepositoryProvider,
    private readonly emailService: EmailService,
  ) {}

  createRequest(data: RequestCreateDto) {
    return this.prisma.request.create({
      data,
    })
  }

  async updateRequest(id: string, data: RequestUpdateDto) {
    const { comment } = data

    const status = RequestStatusEnum.Resolved

    const updatedReq = await this.prisma.request.update({
      where: {
        id,
      },
      data: {
        comment,
        status,
      },
    })

    const to = updatedReq.email
    const text = 'На вашу заявку ответили!'

    await this.emailService.send({ to, text })
    return updatedReq
  }

  findRequests(listing: ListingDto) {
    return this.repository.findMany(
      Prisma.ModelName.Request,
      this.prisma.request,
      listing,
    )
  }
}
