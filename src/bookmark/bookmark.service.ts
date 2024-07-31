import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { BookmarkDto, CreateMultipleBookmarksDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {

  }

  async createMultiple(@GetUser() user: User, dto: CreateMultipleBookmarksDto) {
    if (Array.isArray(dto.bookmarks)) {
      const bookmarks = await Promise.all(dto.bookmarks.map(async (bookmark) => {
        return await this.createBookmark(user, bookmark);
      }));

      return { message: 'Bookmarks created successfully', bookmarks };
    }

    return { message: 'Invalid request' };

  }

  public async createBookmark(@GetUser() user: User, dto: BookmarkDto) {
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

    return bookmark;
  }

  getBookmarkById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id: id
      }
    })
  }

  async getUserBookmarks(userId: number, skip: number = 0, take: number = 10) {
    const bookmarks = await this.prisma.bookmark.findMany({
      skip: skip,
      take: take,
      select: {
        link: true,
        description: true,
        createdAt: true,
        userId: true
      },
      where: {
        userId: +userId
      }
    });

    return bookmarks;
  }
}