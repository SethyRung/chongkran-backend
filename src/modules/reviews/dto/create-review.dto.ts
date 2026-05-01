import { OmitType } from "@nestjs/swagger";
import { ReviewDto } from "./review.dto";

export class CreateReviewDto extends OmitType(ReviewDto, [
  "userId",
  "userName",
  "userAvatar",
  "createdAt",
  "updatedAt",
] as const) {}
