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

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: PostBodyType[];

  @Prop({ required: true })
  category: string[];

  @Prop({ default: {} })
  statistics: PostStatistics;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ default: false })
  isFavorite: boolean;

  @Prop({ required: true })
  backgroundURL: string;

  @Prop({ default: [] })
  imagesURL: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
