import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty()
  @Prop({ required: true })
  firstName: string;

  @ApiProperty()
  @Prop({ required: true })
  lastName: string;

  @ApiProperty()
  @Prop({ unique: true, required: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  password: string;

  @ApiProperty()
  @Prop({ required: false })
  gender: string;

  @ApiProperty()
  @Prop({ required: false })
  dateOfBirth: Date;

  @ApiProperty()
  @Prop({ required: true, enum: ["user", "author", "admin"] })
  role: "user" | "author" | "admin";

  // Author-specific fields
  @ApiProperty({ required: false })
  @Prop()
  bio?: string;

  @ApiProperty({ required: false })
  @Prop([String])
  expertise?: string[];

  @ApiProperty({ required: false })
  @Prop()
  avatar?: string;

  @ApiProperty({ required: false })
  @Prop()
  website?: string;

  @ApiProperty({ required: false })
  @Prop()
  instagram?: string;

  @ApiProperty({ required: false })
  @Prop()
  youtube?: string;

  @ApiProperty({ required: false })
  @Prop()
  tiktok?: string;

  @ApiProperty({ required: false })
  @Prop({ type: [{ type: Types.ObjectId, ref: "Recipe" }], default: [] })
  favoriteRecipes: Types.ObjectId[];

  @ApiProperty({ required: false })
  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }], default: [] })
  followers: Types.ObjectId[];

  @ApiProperty({ required: false })
  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }], default: [] })
  following: Types.ObjectId[];

  @ApiProperty({ required: false })
  @Prop({ default: 0 })
  followersCount?: number;

  @ApiProperty({ required: false })
  @Prop({ default: 0 })
  followingCount?: number;

  @ApiProperty({ required: false })
  @Prop({ default: 0 })
  recipesCount?: number;

  @ApiProperty({ required: false })
  @Prop({ default: 0 })
  totalViews?: number;

  @ApiProperty({ required: false })
  @Prop({ default: 0 })
  totalLikes?: number;

  @ApiProperty({ required: false })
  @Prop({ required: false, enum: ["pending", "approved", "rejected"] })
  authorRequestStatus?: "pending" | "approved" | "rejected";

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
