import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  text: string;
}
