import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'src/common/public.decorator';
import { RtGuard } from 'src/guards/rt.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { SignUpUserDto } from 'src/user/dto/user.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  isProduction = this.configService.get<boolean>('ISPRODUCTION') === true;

  @HttpCode(HttpStatus.CREATED)
  @FormDataRequest()
  @Public()
  @Post('signup')
  async signup(@Body() signUpUserDto: SignUpUserDto) {
    return await this.authService.signUp(signUpUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { tokens, payload } = await this.authService.signIn(dto);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 1235707600,
      httpOnly: true,
      sameSite: 'none',
      secure: false,
    });
    console.log({ accessToken: tokens.accessToken, user: { ...payload } });
    return { accessToken: tokens.accessToken, user: { ...payload } };
  }

  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const user: any = req.user.userId;
    console.log('userId', user);
    await this.authService.logout(user);
    res
      .clearCookie('refreshToken', {
        expires: new Date(Date.now()),
        httpOnly: this.isProduction,
        sameSite: 'none',
        secure: this.isProduction,
      })
      .send();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  @Public()
  @Get('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user: any = req.user;
    const tokens = await this.authService.generateRt(user);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 1235707600,
      httpOnly: true,
      sameSite: 'none',
      secure: false,
    });
    return { accessToken: tokens.accessToken, user };
  }
}
