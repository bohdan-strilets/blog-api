import { Prop, Schema } from '@nestjs/mongoose';
import { CommentsType } from '../types/comments.type';

@Schema({ versionKey: false, _id: false })
export class PostStatistics {
  @Prop()
  numberLikes: number;

  @Prop()
  numberViews: number;

  @Prop()
  numberComments: number;

  @Prop()
  comments: CommentsType[];

  @Prop()
  tags: string[];
}
