import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { RequestService } from '../services/request.service'
import { RequestCreateDto } from '../dto/requestCreate.dto'
import { ListingDto } from '@infrastructure/common/pagination/dto'
import { RequestUpdateDto } from '../dto/requestUpdate.dto'

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() body: RequestCreateDto) {
    return this.requestService.createRequest(body)
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findMany(@Query() listing: ListingDto) {
    return this.requestService.findRequests(listing)
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: RequestUpdateDto,
  ) {
    return this.requestService.updateRequest(id, body)
  }
}
