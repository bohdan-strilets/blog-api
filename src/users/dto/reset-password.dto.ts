import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(15)
  password: string;

  @IsString()
  @IsEmail()
  email: string;
}
