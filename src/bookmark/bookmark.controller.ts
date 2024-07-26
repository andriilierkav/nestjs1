import { Body, Controller, ForbiddenException, Get, Injectable, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto } from './dto';

@Controller('bookmarks')
@UseGuards(JwtGuard)
@Injectable()
export class BookmarkController {

  constructor(private prisma: PrismaService) {
  }

  @Post('create-multiple')
  async createMultiple(@GetUser() user: User, @Body() req: Request) {
      return req;
  }

  @Post('create')
  async create(@GetUser() user: User, @Body() dto: BookmarkDto) {
    let userId = user.id;

    if(typeof dto.userIdentifier !== undefined && dto.userIdentifier) {
      if(+user.permissions <= 1) {
        throw new ForbiddenException('You do not have permission to create link for another user')
      }else{
        const linkUser = await this.prisma.user.findUnique({
          where: {
            id: +dto.userIdentifier
          }
        });

        if(!linkUser) {
          throw new ForbiddenException(`User with ID ${dto.userIdentifier} does not exist`)
        }

        userId = +dto.userIdentifier;
      }
    }

    const bookmark = await this.prisma.bookmark.create({
      data: {
        title: dto.title,
        link: dto.link,
        description: dto.description,
        userId: userId
        }
    });

    return { message: 'Bookmark created successfully', bookmark };
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
