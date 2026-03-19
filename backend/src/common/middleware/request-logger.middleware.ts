import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

//Logs every incoming HTTP request (method + URL) before it enters NestJS pipeline
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(request: Request, _response: Response, next: NextFunction): void {
    console.log(
      `[Middleware] ${request.method} ${request.originalUrl ?? request.url}`,
    );
    next();
  }
}
