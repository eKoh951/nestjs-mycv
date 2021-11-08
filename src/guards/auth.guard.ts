/*
https://docs.nestjs.com/guards#guards
*/

import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // If userId is undefined then we are returning a falsy value
    return request.session.userId;
  }
}
