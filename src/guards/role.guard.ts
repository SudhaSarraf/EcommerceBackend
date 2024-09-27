import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEntity } from '../role/entities/role.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    console.log('request', request);
    const user = request.user;
    console.log('user' + user);

    for (let roleName of requiredRoles) {
      if (user.roles) {
        if (user.roles.some((r: RoleEntity) => r.name === roleName)) {
          return true;
        }
      } else if (user.role) {
        if (user.role.some((r: RoleEntity) => r.name === roleName)) {
          return true;
        }
      }else {
        return false;
      }
    }
  }
}
