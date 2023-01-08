import { TokensType } from './tokens.type';
import { UserType } from './user.type';

export type ResponseType<T = TokensType, U = UserType> = {
  status: string;
  code: number;
  success: boolean;
  message: string;
  tokens?: T;
  user?: U;
};
