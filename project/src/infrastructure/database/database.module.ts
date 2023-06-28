import { Global, Module } from '@nestjs/common'
import { SpleenParserModule } from '../spleen/spleen-parser.module'
import { PrismaService } from './prisma.service'
import { RepositoryProvider } from './repository.provider'

@Global()
@Module({
  imports: [SpleenParserModule],
  providers: [
    PrismaService,
    RepositoryProvider,
  ],
  exports: [
    PrismaService,
    RepositoryProvider,
  ],
})
export class DatabaseModule {}
