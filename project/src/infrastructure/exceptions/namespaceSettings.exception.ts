import { HttpException, HttpStatus } from '@nestjs/common'

export class NamespaceSettingsException extends HttpException {
  constructor() {
    super(
      {
        message:
          'The namespace of the settings must match the namespace in the parameters',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        code: 'INCORRECT_NAMESPACE',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    )
  }
}
