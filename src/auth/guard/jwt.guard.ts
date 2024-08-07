import { ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      let message = 'Access denied';

      if (info && typeof info === 'object') {
        switch (info.name) {
          case 'TokenExpiredError':
            message = 'Token has expired';
            break;
          case 'JsonWebTokenError':
            message = 'Malformed token';
            break;
          case 'NotBeforeError':
            message = 'Token not active';
            break;
          default:
            message = info.message || 'Authentication error';
        }
      }

      throw new ForbiddenException(message);
    }
    return user;
  }
}
