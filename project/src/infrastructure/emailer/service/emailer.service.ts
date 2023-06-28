import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { IEmailService } from './emailer.interface'

@Injectable()
export class EmailService implements IEmailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(emailSendOptions): Promise<boolean> {
    try {
      await this.mailerService.sendMail(emailSendOptions)
      console.log('Thank you letter sent')
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
}
