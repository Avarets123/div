import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EmailModule } from '@infrastructure/emailer/emailer.module'
import { DatabaseModule } from '@infrastructure/database/database.module'
import { RequestModule } from './modules/requests/request.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EmailModule,
    RequestModule,
  ],
  providers: [],
})
export class AppModule {}
