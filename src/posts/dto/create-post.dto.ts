import {
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  IsBoolean,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';
import { PostBodyType } from '../types/post-body.type';

export class CreatePostDto {
  @IsString()
  @MinLength(10)
  @MaxLength(400)
  title: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  body: PostBodyType[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  category: string[];

  @IsBoolean()
  isPublic: boolean;
}
