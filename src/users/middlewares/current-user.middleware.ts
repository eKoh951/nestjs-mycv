/*
https://docs.nestjs.com/middleware#middleware
*/

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

declare global {
  // Go global and find...
  namespace Express {
    // the Express library
    interface Request {
      // find the interface Request inside there
      currentUser?: User; // and add one more property 'currentUser' to that interface
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.currentUser = user;
    }

    next();
  }
}
