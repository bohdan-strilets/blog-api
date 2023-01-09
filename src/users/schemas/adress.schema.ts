import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class Adress {
  @Prop({ default: '' })
  country: string;

  @Prop({ default: '' })
  city: string;

  @Prop({ default: '' })
  postcode: string;
}
