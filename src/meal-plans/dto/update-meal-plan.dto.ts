import { OmitType, PartialType } from "@nestjs/swagger";
import { MealPlanDto } from "./meal-plan.dto";

export class UpdateMealPlanDto extends PartialType(
  OmitType(MealPlanDto, ["id", "userId", "createdAt", "updatedAt"] as const),
) {}
