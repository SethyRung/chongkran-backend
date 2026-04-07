import { OmitType } from "@nestjs/swagger";
import { MealPlanDto } from "./meal-plan.dto";

export class CreateMealPlanDto extends OmitType(MealPlanDto, [
  "id",
  "userId",
  "createdAt",
  "updatedAt",
] as const) {}
