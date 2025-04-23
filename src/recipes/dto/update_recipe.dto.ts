import { OmitType, PartialType } from "@nestjs/swagger";
import { RecipeDto } from "./recipe.dto";

export class UpdateRecipeDto extends PartialType(
  OmitType(RecipeDto, ["likes", "views"] as const)
) {}
