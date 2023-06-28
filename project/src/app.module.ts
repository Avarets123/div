import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EmailModule } from '@infrastructure/emailer/emailer.module'
import { DatabaseModule } from '@infrastructure/database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EmailModule,
  ],
  providers: [],
})
export class AppModule {}
