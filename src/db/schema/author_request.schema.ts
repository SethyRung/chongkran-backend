import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type AuthorRequesDocument = HydratedDocument<AuthorRequest>;

@Schema({ collection: "author_requests" })
export class AuthorRequest {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ["pending", "approved", "rejected"] })
  status: "pending" | "approved" | "rejected";
}

export const AuthorRequesSchema = SchemaFactory.createForClass(AuthorRequest);
