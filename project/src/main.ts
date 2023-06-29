import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { exceptionBoot } from '@infrastructure/exceptions/exception.boot'
import { interceptorBoot } from '@infrastructure/inceptors/inceptors.boot'
import { validationBoot } from '@infrastructure/validation/validation.boot'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  interceptorBoot(app)
  exceptionBoot(app)
  validationBoot(app)
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
