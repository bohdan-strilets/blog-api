import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ versionKey: false, timestamps: true })
export class Token {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ default: null })
  accessToken: string;

  @Prop({ default: null })
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
