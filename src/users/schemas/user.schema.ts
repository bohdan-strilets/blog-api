import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: '2001-01-01' })
  dateBirth: string;

  @Prop({ default: 'other' })
  gender: 'man' | 'woman' | 'other';

  @Prop(
    raw({
      country: { type: String },
      city: { type: String },
      postcode: { type: String },
    }),
  )
  adress: Record<string, any>;

  @Prop({ default: '' })
  phoneNumber: string;

  @Prop({ default: '' })
  profession: string;

  @Prop({ default: [], type: Array })
  hobby: string[];

  @Prop({ default: '' })
  avatarURL: string;

  @Prop({ default: '' })
  backgroundURL: string;

  @Prop({ default: [] })
  posts: any[];

  @Prop({ default: [] })
  projects: any[];

  @Prop({ default: [] })
  stories: any[];

  @Prop({ default: [] })
  statistics: any[];

  @Prop({ required: true })
  activationToken: string;

  @Prop({ default: false })
  isActivated: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
