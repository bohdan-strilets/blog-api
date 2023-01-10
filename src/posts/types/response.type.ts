import { PostType } from './post.type';

export type ResponseType<P = PostType | PostType[]> = {
  status: string;
  code: number;
  success: boolean;
  message: string;
  data?: P;
};
