import { IsEmail, IsString } from 'class-validator'

export class RequestCreateDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  message: string
}
