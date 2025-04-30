import { OmitType, PartialType } from "@nestjs/swagger";
import { ReviewDto } from "./review.dto";

export class UpdateReviewDto extends PartialType(
  OmitType(ReviewDto, [
    "id",
    "recipeId",
    "userId",
    "createdAt",
    "updatedAt",
  ] as const)
) {}
