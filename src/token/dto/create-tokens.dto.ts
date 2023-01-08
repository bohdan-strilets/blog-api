import { Types } from 'mongoose';

export class CreateTokenDto {
  id: Types.ObjectId;
  email: string;
  name: string;
  isActivated: boolean;
}
