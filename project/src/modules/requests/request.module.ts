import { Module } from '@nestjs/common'
import { RequestService } from './services/request.service'
import { RequestController } from './controllers/request.controller'

@Module({
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
