import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class RegistrationDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(15)
  password: string;
}
