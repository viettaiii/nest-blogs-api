import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (key: any, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return key ? request['user'][key] : request['user'];
  },
);
