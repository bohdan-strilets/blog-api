import { Types } from 'mongoose';

type Adress = {
  country: string;
  city: string;
  postcode: string;
};

export type UserType = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  dateBirth: Date;
  gender: 'man' | 'woman' | 'other';
  adress: Adress;
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
  createdAt: Date;
  updatedAt: Date;
};
