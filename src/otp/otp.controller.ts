import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { OtpService } from './otp.service';
import { Public } from 'src/common/public.decorator';
import { OtpDto } from './dto/otp.dto';

@Public()
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {
  }


  @Patch('/generate/:userId')
  async createOTP(@Param('userId') userId: string) {
    return await this.otpService.generateAndPatchOTP(userId);
  }

  @Patch('/verify/:userId')
  async verifyOTP(@Param('userId') userId: string, @Body() otpDto: OtpDto) {
    return await this.otpService.verifyGeneratedOTP(otpDto.otp, userId, otpDto.newPassword);
  }
}
