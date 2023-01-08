import { Types } from 'mongoose';

export type UserType = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  dateBirth: string;
  gender: 'man' | 'woman' | 'other';
  phoneNumber: string;
  profession: string;
  avatarURL: string;
  backgroundURL: string;
  hobby: string[];
  posts: any[];
  projects: any[];
  stories: any[];
  statistics: any[];
  isActivated: boolean;
};
