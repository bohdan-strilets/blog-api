import { PostBodyType } from '../types/post-body.type';

export class UpdatePostDto {
  title: string;
  body: PostBodyType[];
  category: string[];
  tags: string[];
}
