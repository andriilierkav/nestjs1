import { Controller, ForbiddenException, Get, Injectable, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
@UseGuards(JwtGuard)
@Injectable()
export class UserController {

  constructor(private prisma: PrismaService) {
  }
  @Get('me')
  getMe(@GetUser() user: User) {
    // console.log(req.user.email);
    return user;
  }

  @Get('me/email')
  getMyEmail(@GetUser('email') email: string, @Req() req: Request) {
    return email;
  }

  @Get('get-all')
  getAll(@GetUser() user: User) {

    if(+user.permissions <= 1) {
      throw new ForbiddenException('You do not have permission to access this resource')
    }

    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        firstName: true,
        lastName: true
      }
    });
  }

@Get('get/:id')
  getOne(@GetUser() user: User, @Req() req: Request) {
    if(+user.permissions <= 1) {
      throw new ForbiddenException('You do not have permission to access this resource')
    }

    return this.prisma.user.findUnique({
      where: {
        id: +req.params.id
      }
    });
  }
}
