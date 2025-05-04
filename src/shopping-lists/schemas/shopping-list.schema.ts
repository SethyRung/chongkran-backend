import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ShoppingListDocument = ShoppingList & Document;

@Schema({
  collection: "shopping-list",
  timestamps: { createdAt: true, updatedAt: false },
})
export class ShoppingList {
  @Prop({ type: Types.ObjectId, ref: "User", required: true, unique: true })
  userId: Types.ObjectId;

  @Prop([
    {
      name: { type: String, required: true },
      quantity: { type: String, required: true },
      checked: { type: Boolean, default: false },
    },
  ])
  items: {
    name: string;
    quantity: string;
    checked: boolean;
  }[];

  @Prop()
  createdAt: Date;
}

export const ShoppingListSchema = SchemaFactory.createForClass(ShoppingList);
