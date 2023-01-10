import { CommentsType } from './comments.type';

export type StatisticsType = {
  numberLikes: number;
  numberViews: number;
  numberComments: number;
  comments: CommentsType[];
  tags: string[];
};
