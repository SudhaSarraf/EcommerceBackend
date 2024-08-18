import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from "rxjs";
import { UserEntity } from 'src/user/entities/user.entity';
import { EntityNotFoundException } from 'src/common/errors/entityNotFoundException';

@Injectable()
export class OtpService {
  constructor(private readonly entityManager: EntityManager, private readonly httpService: HttpService) {
  }

  async generateAndPatchOTP(email: string) {
    let successMessage: string;
    try {
      let userId: number;
      let resultOTP = await this.entityManager.transaction(async eManager => {
        if (!email || email === '') throw new InternalServerErrorException('User Id Missing.');
        let generatedOTP: number;
        do {
          const otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
          generatedOTP = Number(otp);
        } while (generatedOTP < 1000 || generatedOTP > 9999);

        if (generatedOTP < 1000 || generatedOTP > 9999) throw new InternalServerErrorException();
        const [userData] = await Promise.all([eManager.find(UserEntity, {
          where: {
            email: email,
            deletedAt: null
          },
          select: {
            userId: true,
            email: true,
            otp1: true,
            otp2: true,
            otp3: true,
          },
        })]);

        if (userData.length <= 0) throw new EntityNotFoundException('Cannot find this email.');
        if (userData.length > 1) throw new InternalServerErrorException('You have more then one active email accounts, Please contact support.');

        userId = userData[0].userId;
        let result: UpdateResult;
        if (userData) {
          if (!userData[0].otp1) {
            result = await eManager.update(UserEntity, userId, {
              otp1: generatedOTP,
              otp2: null
            });
          } else if (!userData[0].otp2) {
            result = await eManager.update(UserEntity, userId, {
              otp2: generatedOTP,
              otp3: null
            });
          } else if (!userData[0].otp3) {
            result = await eManager.update(UserEntity, userId, {
              otp3: generatedOTP,
              otp1: null
            });
          } else {
            result = await eManager.update(UserEntity, userId, {
              otp1: generatedOTP,
              otp2: null
            });
          }
        }

        if (result.affected <= 0) throw new InternalServerErrorException('Error while updating OTP.');

        let mailData = {
          "subject": `OTP for password reset for user ${email}`,
          "message": `The OPT for for resetting your password is ${generatedOTP}. Please keep your account secure.`,
          "receiverMail": `${email}`
        };


        let apiUrl = "https://mailservice.technexaverse.com/mail/auth/register/send";

        const response = await firstValueFrom(this.httpService.post(apiUrl, mailData));

        if (response.status === 200 || 201) return response;
      });
      // console.log('response.status', resultOTP.status, 'resultOTP', userId, 'resultOTP', resultOTP)
      if (resultOTP.status === 200 || 201) return { userId: userId, message: `${resultOTP.data.message}` };
      else throw new InternalServerErrorException('OTP Not Sent.');
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async verifyGeneratedOTP(otp: number, email: string, newPassword: string) {
    try {
      let result = await this.entityManager.transaction(async eManager => {
        // console.log((otp > 999 || otp < 10000), (email != null || undefined || ''), (newPassword != null || undefined || ''));
        if ((otp < 999 || otp > 10000) && (email == null || undefined || '') && (newPassword == null || undefined || '')) throw new InternalServerErrorException('Information missing');
        const [userData] = await Promise.all([eManager.find(UserEntity, {
          where: {
            email: email,
            deletedAt: null
          },
          select: {
            userId: true,
            email: true,
            otp1: true,
            otp2: true,
            otp3: true,
          },
        })]);

        if (userData.length <= 0) throw new EntityNotFoundException('Wrong user Info.');

        // console.log(otp !== userData[0].otp1, otp !== userData[0].otp2, otp !== userData[0].otp3)
        if (otp !== userData[0].otp1 && otp !== userData[0].otp2 && otp !== userData[0].otp3) throw new EntityNotFoundException('Wrong OTP.');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        if (!hashedPassword) throw new InternalServerErrorException('Internal server error');

        let updatePassword = await eManager.update(UserEntity, userData[0].userId, {
          password: hashedPassword,
          otp1: null,
          otp2: null,
          otp3: null
        });
        if (updatePassword.affected === 1) return updatePassword.affected;
      });
      if (result === 1) return { message: 'Password Updated successfully' };
      else throw new InternalServerErrorException('New Password not updated.');
    }
    catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
