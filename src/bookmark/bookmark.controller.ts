import { Body, Controller, ForbiddenException, Get, Injectable, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto, CreateMultipleBookmarksDto } from './dto';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
@UseGuards(JwtGuard)
@Injectable()
export class BookmarkController {

  constructor(private prisma: PrismaService, private bookmarkService: BookmarkService) {
  }

  @Post('create-multiple')
  async createMultiple(@GetUser() user: User, @Body() dto: CreateMultipleBookmarksDto) {
    return await this.bookmarkService.createMultiple(user, dto);
  }

  @Post('create')
  async create(@GetUser() user: User, @Body() dto: BookmarkDto) {
    const bookmark = await this.bookmarkService.createBookmark(user, dto);
    return { message: 'Bookmark created successfully', bookmark };
  }


  @Get('get/:id')
  getOne(@GetUser() user: User, @Req() req: Request) {
    if(+user.permissions <= 1 && user.id !== +req.params.id) {
      throw new ForbiddenException('You do not have permission to access this resource')
    }

    return this.bookmarkService.getBookmarkById(+req.params.id);
  }


  @Get('get-all')
  async getAll(@GetUser() user: User) {
    const bookmarks = await this.bookmarkService.getUserBookmarks(user.id);
    return bookmarks;
  }

  @Get('get-all/:id/:skip/:take')
  async getAllForUser(@GetUser() user: User, @Req() req: Request) {
    if(+user.permissions <= 1 || !req.params.id) {
      throw new ForbiddenException('You do not have permission to access this resource')
    }

    const neededUser = await this.prisma.user.findUnique({
      where: {
        id: +req.params.id
      }
    });

    if(!neededUser) {
      throw new ForbiddenException(`User with ID ${req.params.id} does not exist`)
    }

    return this.bookmarkService.getUserBookmarks(neededUser.id, +req.params.skip || 0, +req.params.take || 20);
  }
}
