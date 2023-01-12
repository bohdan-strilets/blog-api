import { Types } from 'mongoose';
import { PostBodyType } from './post-body.type';
import { StatisticsType } from './statistics.type';
import { OwnerType } from './owner.type';
import { WhoLikes } from '../schemas/who-likes.schema';

export type PostType = {
  _id: Types.ObjectId;
  owner: OwnerType;
  title: string;
  body: PostBodyType[];
  category: string[];
  statistics: StatisticsType;
  whoLikes: WhoLikes[];
  isPublic: boolean;
  isFavorite: boolean;
  backgroundURL: string;
  imagesURL: string[];
  createdAt: Date;
  updatedAt: Date;
};
