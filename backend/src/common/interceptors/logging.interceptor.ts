import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';


//Measures execution time and logs details
@Injectable() // makes it injectable in Nest DI system
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp(); // HTTP context
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const startedAt = Date.now(); // start timer

    console.log(
      `[Interceptor:Before] ${request.method} ${request.originalUrl ?? request.url}`,
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startedAt; // calculate time
        response.setHeader('X-Response-Time', `${duration}ms`); // custom header

        console.log(
          `[Interceptor:After] ${request.method} ${
            request.originalUrl ?? request.url
          } ${response.statusCode} - ${duration}ms`,
        );
      }),
    );
  }
}