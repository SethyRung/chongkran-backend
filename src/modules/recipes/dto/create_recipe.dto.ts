import { OmitType } from "@nestjs/swagger";
import { RecipeDto } from "./recipe.dto";

export class CreateRecipeDto extends OmitType(RecipeDto, [
  "id",
  "author",
  "likes",
  "views",
  "status",
  "createdAt",
  "updatedAt",
] as const) {}
