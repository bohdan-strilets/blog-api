import { Prop, Schema } from '@nestjs/mongoose';
import { CommentsType } from '../types/comments.type';

@Schema({ versionKey: false, _id: false })
export class PostStatistics {
  @Prop({ default: 0 })
  numberLikes: number;

  @Prop({ default: 0 })
  numberViews: number;

  @Prop({ default: 0 })
  numberComments: number;

  @Prop({ default: [] })
  comments: CommentsType[];

  @Prop({ default: [] })
  tags: string[];
}
