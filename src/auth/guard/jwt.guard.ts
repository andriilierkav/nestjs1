import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}