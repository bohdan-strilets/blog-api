import { Types } from 'mongoose';
import { PostBodyType } from './post-body.type';
import { StatisticsType } from './statistics.type';

export type PostType = {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  title: string;
  body: PostBodyType[];
  category: string[];
  statistics: StatisticsType[];
  isPublic: boolean;
  isFavorite: boolean;
  backgroundURL: string;
  imagesURLs: string;
  createdAt: Date;
  updatedAt: Date;
};
