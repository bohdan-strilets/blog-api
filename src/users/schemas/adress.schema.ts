import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdressDocument = HydratedDocument<Adress>;

@Schema({ versionKey: false, _id: false })
export class Adress {
  @Prop({ default: '' })
  country: string;

  @Prop({ default: '' })
  city: string;

  @Prop({ default: '' })
  postcode: string;
}

export const AdressSchema = SchemaFactory.createForClass(Adress);
