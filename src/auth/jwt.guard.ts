import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';

import { verifyToken } from './jwt.util';

@Injectable() // Marks this class as a provider that NestJS can inject
export class JwtGuard implements CanActivate {

  // This method runs BEFORE the controller route handler
  // It decides whether the request is allowed to continue or not
  canActivate(context: ExecutionContext): boolean {

    // Extract the HTTP request object from NestJS execution context
    const request = context.switchToHttp().getRequest();

    // Get the Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = request.headers['authorization'];

    // If Authorization header is missing → reject request
    if (!authHeader) {
      throw new UnauthorizedException("Token missing");
    }
    
    // Split header by space
    // "Bearer eyJhbGciOiJIUzI1NiIs..."
    // After split -> ["Bearer", "token"]
    const token = authHeader.split(' ')[1];

    // If token part does not exist → header format is wrong
    if (!token) {
      throw new UnauthorizedException("Token malformed");
    }

    try {

      // Verify JWT token using your utility function
      // If valid → returns decoded payload
      const payload = verifyToken(token);

      // Attach decoded payload to request
      // Now controllers can access request.user
      request.user = payload;

      // Allow request to proceed to the controller
      return true;

    } catch {

      // If verification fails → token invalid or expired
      throw new UnauthorizedException("Invalid token");
    }
  }
}