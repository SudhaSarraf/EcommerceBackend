import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            session: true,
            passwordField: 'password',
            // passReqToCallback: true,
        });
    }

    // async validate(email: string, password: string): Promise<Users> {
        
    //     const user = await this.authService.valiateUser(email, password);
    //     if (!user) {
    //         throw new UnauthorizedException('The given credentials are invalid');
    //     }
    //     return user;
    // }
}