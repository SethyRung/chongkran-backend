import { OmitType } from "@nestjs/swagger";
import { ReviewDto } from "./review.dto";

export class CreateReviewDto extends OmitType(ReviewDto, [
  "id",
  "recipeId",
  "userId",
  "createdAt",
  "updatedAt",
] as const) {}
