import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type RecipeDocument = HydratedDocument<Recipe>;

@Schema()
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  ingredients: { name: string; quantity: string }[];

  @Prop({ required: true })
  steps: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  author: Types.ObjectId;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  cookTime: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: 0 })
  views: number;

  @Prop({ required: true, enum: ["low", "medium", "hight"] })
  difficulty: "low" | "medium" | "hight";

  @Prop({ default: "pending", enum: ["pending", "approved", "rejected"] })
  status: "pending" | "approved" | "rejected";

  @Prop({ required: true, type: Types.ObjectId, ref: "Category" })
  category: Types.ObjectId;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
