import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type MealPlanDocument = MealPlan & Document;

@Schema({ collection: "meal-plan", timestamps: true })
export class MealPlan {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop([
    {
      recipeId: { type: Types.ObjectId, ref: "Recipe", required: true },
      day: { type: String, required: true },
      mealType: { type: String, required: true },
    },
  ])
  recipes: {
    recipeId: Types.ObjectId;
    day: string;
    mealType: string;
  }[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MealPlanSchema = SchemaFactory.createForClass(MealPlan);
