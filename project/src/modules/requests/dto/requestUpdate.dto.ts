import { IsString } from 'class-validator'

export class RequestUpdateDto {
  @IsString()
  comment: string
}
