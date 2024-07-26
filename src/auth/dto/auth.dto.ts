import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}
export class SignupDto extends SigninDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
}