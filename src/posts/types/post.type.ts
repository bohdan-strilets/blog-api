import { Types } from 'mongoose';
import { PostBodyType } from './post-body.type';
import { StatisticsType } from './statistics.type';
import { OwnerType } from './owner.type';

export type PostType = {
  _id: Types.ObjectId;
  owner: OwnerType;
  title: string;
  body: PostBodyType[];
  category: string[];
  statistics: StatisticsType;
  isPublic: boolean;
  isFavorite: boolean;
  backgroundURL: string;
  imagesURL: string[];
  createdAt: Date;
  updatedAt: Date;
};
