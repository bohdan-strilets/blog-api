import { Types } from 'mongoose';

export type CommentsType = {
  id: string;
  owner: Types.ObjectId;
  text: string;
  numberLikes: number;
  answers?: CommentsType[];
};
