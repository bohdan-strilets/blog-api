import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PostStatistics } from './post-statistics.schema';
import { User } from 'src/users/schemas/user.schema';
import { PostBodyType } from '../types/post-body.type';

export type PostDocument = HydratedDocument<Post>;

@Schema({ versionKey: false, timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop()
  title: string;

  @Prop()
  body: PostBodyType[];

  @Prop()
  category: string[];

  @Prop()
  statistics: PostStatistics;

  @Prop()
  isPublic: boolean;

  @Prop()
  backgroundURL: string;

  @Prop()
  imagesURLs: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
