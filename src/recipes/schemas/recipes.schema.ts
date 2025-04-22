import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document, HydratedDocument, ObjectId, Types } from "mongoose";

export type RecipesDocument = HydratedDocument<Recipes>;

@Schema()
export class Recipes {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({ required: true })
  ingredients: { name: string; quantity: string }[];

  @ApiProperty()
  @Prop({ required: true })
  steps: string[];

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  author: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  tags: string[];

  @ApiProperty()
  @Prop({ required: true })
  image: string;

  @ApiProperty()
  @Prop({ required: true })
  cookTime: number;

  @ApiProperty()
  @Prop({ default: 0 })
  likes: number;

  @ApiProperty()
  @Prop({ default: 0 })
  views: number;

  @ApiProperty()
  @Prop({ required: true, enum: ["low", "medium", "hight"] })
  difficulty: "low" | "medium" | "hight";

  @ApiProperty()
  @Prop({ default: "pending", enum: ["pending", "approved", "rejected"] })
  status: "pending" | "approved" | "rejected";

  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId, ref: "Category" })
  category: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true })
  createdAt: Date;

  @ApiProperty()
  @Prop({ required: true })
  updatedAt: Date;
}

export const RecipesSchema = SchemaFactory.createForClass(Recipes);
