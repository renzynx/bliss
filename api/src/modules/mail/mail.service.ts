import { Injectable } from "@nestjs/common";
import { Transporter, createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

@Injectable()
export class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  createInstance() {
    this.transporter = createTransport({
      host: process.env.MAIL_HOST,
      port: +process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    return this;
  }

  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      to,
      subject,
      html,
      from: process.env.MAIL_FROM,
    });
  }
}
