import { Types } from 'mongoose';

type Adress = {
  country: string;
  city: string;
  postcode: string;
};

type SocialMedia = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  github: string;
};

export type UserType = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  dateBirth: Date;
  gender: 'man' | 'woman' | 'other';
  adress: Adress;
  socialMedia: SocialMedia;
  phoneNumber: string;
  profession: string;
  description: string;
  avatarURL: string;
  backgroundURL: string;
  hobby: string[];
  isActivated: boolean;
  createdAt: Date;
  updatedAt: Date;
};
