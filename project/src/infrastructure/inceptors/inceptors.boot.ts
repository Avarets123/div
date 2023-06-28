import { INestApplication } from '@nestjs/common'
import { LoggerErrorInterceptor } from 'nestjs-pino'

export function interceptorBoot(app: INestApplication) {
  app.useGlobalInterceptors(new LoggerErrorInterceptor())
}
