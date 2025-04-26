import { OmitType, PartialType } from "@nestjs/swagger";
import { RecipeDto } from "./recipe.dto";

export class UpdateRecipeDto extends PartialType(
  OmitType(RecipeDto, [
    "id",
    "likes",
    "views",
    "status",
    "createdAt",
    "updatedAt",
  ] as const)
) {}
