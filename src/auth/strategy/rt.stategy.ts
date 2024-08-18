import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { Request } from 'express';
import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';

/* Sending refresh token in authorization header,ideally, we want to send RT in a cookie,
so we use the 2nd implementation for now.
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'rt-secret',
            passReqToCallback: true
        });
    }

    validate(req: Request, payload: any) {

        // this function will receive the decoded payload, and when we return the payload from this function,
        // it will be attacted to req.user object, if we do req.user anywhere, we have the contents of the payload available.

        const refreshToken = req.get('authorization').replace('Bearer', '').trim();

        return { ...payload, refreshToken };

    }
}
*/

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {

    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService
    ) {
        super({
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromExtractors([
                RtStrategy.extractJWTFromCookie
            ]),
            ignoreExpiration: false,
            secretOrKey: "rt-secret"   // change this in production,
        });
    }

    private static extractJWTFromCookie(req: Request): string | null {
        if (req.cookies && req.cookies.refreshToken) {
            return req.cookies.refreshToken;
        }
        return null;
    }

    async validate(req: Request, payload: any) {
        // throw new UnauthorizedException("invalid refresh token")
        const token = req.cookies?.refreshToken;
        if (!token)
            throw new ForbiddenException();

        try {
            const user = this.authService.validateUserAndRt(payload, token);
            return user;
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException('Invalid refresh token');
            } else {
                throw error; // Re-throw other errors
            }
        }
    }
}