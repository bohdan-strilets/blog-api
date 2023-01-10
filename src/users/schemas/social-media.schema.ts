import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class SocialMedia {
  @Prop({ default: '' })
  facebook: string;

  @Prop({ default: '' })
  instagram: string;

  @Prop({ default: '' })
  linkedin: string;

  @Prop({ default: '' })
  twitter: string;

  @Prop({ default: '' })
  github: string;
}
