import { UserType } from 'src/auth/types/user.type';

export type OwnerType = Pick<UserType, 'firstName' | 'lastName' | 'email' | 'profession'>;
