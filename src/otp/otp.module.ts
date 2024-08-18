import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { HttpModule } from '@nestjs/axios';
import { OtpController } from './otp.controller';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    })
  ],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule { }
