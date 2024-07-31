import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  userIdentifier?: number;
}

export class CreateMultipleBookmarksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookmarkDto)
  bookmarks: BookmarkDto[];
}