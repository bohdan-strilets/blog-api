import { IsString, IsEmail } from 'class-validator';

export class EmailDto {
  @IsString()
  @IsEmail()
  email: string;
}
