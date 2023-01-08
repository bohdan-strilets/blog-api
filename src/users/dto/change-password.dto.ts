import { IsString, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(15)
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(15)
  newPassword: string;
}
