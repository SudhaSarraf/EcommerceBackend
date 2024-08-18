import { IsNumber, IsString } from 'class-validator';

export class OtpDto {

    @IsNumber()
    otp: number

    @IsString()
    newPassword: string
}

