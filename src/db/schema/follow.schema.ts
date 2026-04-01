import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

export type FollowDocument = HydratedDocument<Follow>;

@Schema({ timestamps: true })
export class Follow {
  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  follower: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  following: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

// Compound index to prevent duplicate follows
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });
