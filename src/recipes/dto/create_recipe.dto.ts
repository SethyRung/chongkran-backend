import { OmitType } from "@nestjs/swagger";
import { RecipeDto } from "./recipe.dto";

export class CreateRecipeDto extends OmitType(RecipeDto, [
  "id",
  "likes",
  "views",
  "status",
  "createdAt",
  "updatedAt",
] as const) {}
