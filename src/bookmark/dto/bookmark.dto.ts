import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

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