import { OmitType, PartialType } from "@nestjs/swagger";
import { ReviewDto } from "./review.dto";

export class UpdateReviewDto extends PartialType(
  OmitType(ReviewDto, ["userId", "userName", "userAvatar", "createdAt", "updatedAt"] as const),
) {}
