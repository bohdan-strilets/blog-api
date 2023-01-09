import { TokensType } from './tokens.type';
import { UserType } from './user.type';

export type ResponseType<T = TokensType, U = UserType, I = string | string[]> = {
  status: string;
  code: number;
  success: boolean;
  message: string;
  tokens?: T;
  user?: U;
  imageURL?: I;
};
