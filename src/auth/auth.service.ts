import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from '@nestjs/jwt';
import { RoleService } from 'src/role/role.service';
import { FilesService } from '../files/files.service';
import { UserService } from 'src/user/users.service';
import { AuthDto } from './dto/auth.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { RoleEntity } from 'src/role/entities/role.entity';
import { SignUpUserDto } from 'src/user/dto/user.dto';
import { CompnayInfoService } from 'src/company-info/company-info.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly fileService: FilesService,
    private readonly companyService: CompnayInfoService,
    private jwtService: jwt.JwtService,
  ) {}

  async login(@Req() request) {
    // Use Passport's authenticate method with the appropriate strategy
    return request.user;
  }

  async logout(userId: number) {
    return await this.userService.logout(userId);
  }

  /**
   * update refresh token hash in user table
   * @param userId
   * @param refreshToken
   */
  async updateHashedToken(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.userService.updateHashedRt(userId, hash);
  }

  async validateRefresh(token: string) {
    const jwt = await this.jwtService.decode(token);
    console.log(jwt);
  }

  /**
   * JWT signIn
   * @param email
   * @param pass
   * @returns
   */
  async signIn(dto: AuthDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new HttpException('User not found!', 400);

    const company = await this.companyService.findOne(user.companyId);
    if (!company.inService)
      throw new UnauthorizedException('Company is currently out of service.');

    const isPassValid = await bcrypt.compare(dto.password, user.password);

    if (!isPassValid)
      throw new UnauthorizedException('Email or password incorrect');
    const roleNames = user.roles.map((r) => r.name);
    const payload = {
      sub: user.userId,
      email: user.email,
      role: roleNames,
      company: company.id,
      fiscalYear: company.fiscalYear,
    };

    const tokens = await this.getTokens(
      user.userId,
      user.email,
      roleNames,
      company.id,
      company.fiscalYear,
    );
    await this.updateHashedToken(user.userId, tokens.refreshToken);
    return { tokens, payload };
  }

  async validateUserAndRt(
    payload: any,
    rt: string,
  ): Promise<UserEntity | never> {
    const foundUser = await this.userService.findUserById(payload.sub); // sub has userId

    if (!foundUser) {
      throw new ForbiddenException(); // User not found
    }

    if (!(await bcrypt.compare(rt, foundUser.hashedRt))) {
      throw new ForbiddenException(); // Refresh token mismatch
    }

    return foundUser; // Valid user and refresh token
  }

  async signUp(userData: SignUpUserDto) {
    if (userData.companyId <= 0) {
      throw new HttpException('Company id not valid', 400);
    }

    let fileName;
    if (userData.image)
      fileName = await this.fileService.processFile(userData.image);
    // const fileName = await this.fileService.processFile(userData.image);

    const company = await this.companyService.findOne(userData.companyId);
    if (!company.inService) {
      throw new UnauthorizedException('Company is currently out of service.');
    }

    // Check if a user with incoming email already exists in db
    const exists = await this.userService.findByEmail(userData.email);
    if (exists) {
      throw new HttpException('User with this email already exists', 400);
    }

    // Check if the roles assigned to the userdto exist in the database
    const foundRoles = await this.roleService.findAll();
    if (!foundRoles) {
      throw new HttpException('Roles not found in the database', 400);
    }

    // Ensure userData.roles is always an array
    let roles = Array.isArray(userData.roles)
      ? userData.roles
      : (userData.roles = ['user']);

    console.log('roles', roles);
    // If no roles are provided, assign the default role "user"
    // if (!roles || roles.length === 0) {
    //     roles = ['user'];
    // }

    // Match all dto roles from roles in the database
    const mapped: RoleEntity[] = roles.map((name) => {
      const role = foundRoles.find((r) => r.name === name);
      if (!role) {
        throw new Error(`Role ${name} not found`);
      }
      return role;
    });

    // Hash the incoming password before saving it in the database
    const hashPassword = await this.hashData(userData.password);
    const userEntity = {
      ...userData,
      password: hashPassword,
      companyId: company.id,
      roles: mapped,
      image: fileName,
      fiscalYear: company.fiscalYear,
    };

    const newUser = await this.userService.create(userEntity);

    const tokens = await this.getTokens(
      newUser.userId,
      newUser.email,
      roles,
      userData.companyId,
      userData.fiscalYear,
    );

    await this.updateHashedToken(newUser.userId, tokens.refreshToken);
    return tokens;
  }

  async generateRt(user: any) {
    const tokens = await this.getTokens(
      user.userId,
      user.email,
      user.role,
      user.companyId,
      user.fiscalYear
    );
    await this.updateHashedToken(user.userId, tokens.refreshToken);
    return tokens;
  }

  /**
   * This function generates access and refresh tokens, with the payload that we supply in params
   * @param userId
   * @param email
   * @param roles
   *
   */
  async getTokens(
    userId: number,
    email: string,
    roles: string[],
    companyId: number,
    fiscalYear: string,
  ) {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            sub: userId,
            email: email,
            roles: roles,
            companyId: companyId,
            fiscalYear: fiscalYear,
          },
          {
            secret: 'at-secret',
            expiresIn: '15m',
          },
        ),
        this.jwtService.signAsync(
          {
            sub: userId,
            email: email,
            roles: roles,
            companyId: companyId,
            fiscalYear: fiscalYear,
          },
          {
            secret: 'rt-secret',
            expiresIn: '15d', // 1 day
          },
        ),
      ]);
      return { accessToken, refreshToken };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * Util function to encrypt strings like password, tokens
   * @param data
   * @returns hashed string
   */
  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }
}
