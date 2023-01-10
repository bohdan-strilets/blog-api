import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';
import { EmailType } from './types/email.type';

@Injectable()
export class SendgridService {
  constructor() {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(data: any): Promise<void> {
    const email = { ...data, from: process.env.SENDGRID_OWNER };

    try {
      await sendgrid.send(email);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Bad request.',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  confirmEmail(email: string, activationToken: string): EmailType {
    return {
      to: email,
      subject: 'Completion of registration by programmer blog.',
      html: `
      <div>
        <h1>Welcome to Programmer blog</h1>
        <br /><br />
        <p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"</p>
        <hr />
        <p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"</p>
        <p>Thank you for yusing our service.</p>
        <br /><br />
        <a target="_blank" href="${process.env.API_URL}/api/v1/users/verification-email/${activationToken}">Finish registration</a>
        <br />
        <a target="_blank" href="${process.env.API_URL}/api/v1/users/verification-email/${activationToken}">${process.env.API_URL}/api/v1/users/verification-email/${activationToken}</a>
      </div>
    `,
    };
  }

  resetPassword(email: string, name: string): EmailType {
    return {
      to: email,
      subject: 'Reset password for programmer blog.',
      html: `
      <div>
        <h1>Hello ${name}</h1>
        <br /><br />
        <p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"</p>
        <hr />
        <p>"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"</p>
        <p>Thank you for yusing our service.</p>
        <br /><br />
        <p>Нou received this email because you are trying to recover your password to the site ${process.env.CLIENT_URL}</p>
        <br />
        <p>If you have not applied for a password reset, please ignore this email.<p/>
        <br />
        <a target="_blank" href="${process.env.CLIENT_URL}/reset-password">Restore password</a>
      </div>
    `,
    };
  }
}
