import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Adress } from './adress.schema';
import { SocialMedia } from './social-media.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true, minlength: 3, maxlength: 30 })
  firstName: string;

  @Prop({ required: true, minlength: 3, maxlength: 30 })
  lastName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: new Date() })
  dateBirth: Date;

  @Prop({ default: 'other', enum: ['man', 'woman', 'other'] })
  gender: 'man' | 'woman' | 'other';

  @Prop({ default: {} })
  adress: Adress;

  @Prop({ default: {} })
  socialMedia: SocialMedia;

  @Prop({ default: '' })
  phoneNumber: string;

  @Prop({ default: '' })
  profession: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: [], type: Array })
  hobby: string[];

  @Prop({ default: '' })
  avatarURL: string;

  @Prop({ default: '' })
  backgroundURL: string;

  @Prop({ required: true })
  activationToken: string;

  @Prop({ default: false })
  isActivated: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
