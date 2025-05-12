import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String, required: true })
  fullName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
