import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class RecipeEntryDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  recipeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  day: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mealType: string;
}
