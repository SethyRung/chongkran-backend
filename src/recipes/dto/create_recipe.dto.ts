import { OmitType } from "@nestjs/swagger";
import { RecipeDto } from "./recipe.dto";

export class CreateRecipeDto extends OmitType(RecipeDto, [
  "likes",
  "views",
] as const) {}
