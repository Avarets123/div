import { HttpException, HttpStatus } from '@nestjs/common'

export class ModelUniqueException extends HttpException {
  constructor(model: string, message: string) {
    super(
      {
        message,
        code: `${model.toUpperCase()}_MUST_BE_UNIQUE`,
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}
