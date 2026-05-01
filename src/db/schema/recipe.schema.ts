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
  authorName: string;

  @Prop()
  authorAvatar?: string;

  @Prop()
  authorBio?: string;

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

  @Prop({ required: true, enum: ["easy", "medium", "hard"] })
  difficulty: "easy" | "medium" | "hard";

  @Prop({ default: "pending", enum: ["pending", "approved", "rejected"] })
  status: "pending" | "approved" | "rejected";

  @Prop({ required: true, type: Types.ObjectId, ref: "Category" })
  category: Types.ObjectId;

  @Prop([
    {
      _id: { type: Types.ObjectId, auto: true },
      userId: { type: Types.ObjectId, ref: "User", required: true },
      userName: { type: String, required: true },
      userAvatar: { type: String },
      rating: { type: Number, default: 0 },
      comment: { type: String, required: true },
      createdAt: { type: Date, required: true },
      updatedAt: { type: Date, required: true },
    },
  ])
  reviews: {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  }[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
