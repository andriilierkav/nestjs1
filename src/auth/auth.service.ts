import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from '../logger/logger.module';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    // private logger: LoggerModule
  ) {}

  async signup( dto: SignupDto) {
    try {
      const passHash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: passHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          permissions: '1',
        },
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true
        // }
      },);

      return  this.signToken(user.id, user.email);
    }catch (error) {
      if(error instanceof PrismaClientKnownRequestError){
        if(error.code === 'P2002') {
          throw new ForbiddenException('Email already exists')
        }
      }
    }

  }

  async signin( dto: SigninDto) {
    const user  = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })

    if(!user || !await argon.verify(user.hash, dto.password)) {
      throw new ForbiddenException('Invalid email or password')
    }

    delete user.hash


    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string, expires_in: string }> {
    const secret = this.config.get('JWT_SECRET');
    const expires = this.config.get('TOKEN_EXPIRES_IN');
    const token = await this.jwt.signAsync({ sub: userId, email: email }, { expiresIn: parseInt(expires), secret: secret })
    return { access_token: token, expires_in: expires }
  }
}