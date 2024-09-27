import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/users.service';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'at-secret',
      ignoreExpiration: false,
      passReqToCallback: true,
    });
    console.log('at-strategy called');
  }

  async validate(req: Request, payload: any /*done: VerifiedCallback*/) {
    // validate payload against database
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    const user = await this.userService.findUserById(payload.sub);
    if (!user) throw new ForbiddenException('Access Denied');

    // console.log(accessToken); // i need it here as 'Bearer e*****.....'
    req.user = user;
    return user;
  }
}
