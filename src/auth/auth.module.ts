import { DynamicModule, Module, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AtGuard } from 'src/guards/at.guard';
import { RtGuard } from 'src/guards/rt.guard';
import { RoleModule } from 'src/role/role.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FilesService } from 'src/files/files.service';
import { UsersModule } from 'src/user/users.module';
import { FilesModule } from 'src/files/files.module';
import { AtStrategy } from './strategy/at.strategy';
import { RtStrategy } from './strategy/rt.stategy';
import { CompnayInfoModule } from 'src/company-info/company-info.module';
import { CompnayInfoService } from 'src/company-info/company-info.service';

@Module({
  // use this with plain jwt without passport library
  // imports: [UsersModule, JwtModule.register({
  //   global: true,
  //   secret: jwtConstants.secret,
  //   signOptions: { expiresIn: '15m' }
  // })],
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule,
    RoleModule,
    NestjsFormDataModule,
    FilesModule,
    CompnayInfoModule,
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    AtGuard,
    RtGuard,
    CompnayInfoService,
  ],
  exports: [AuthService, AtGuard, RtGuard],
})
export class AuthModule {}
