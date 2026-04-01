import { IsMongoId, IsNotEmpty, IsString, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { RecipeEntryDto } from "./recipe-entity.dto";

export class MealPlanDto {
  @ApiProperty()
  @IsMongoId()
  id: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [RecipeEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeEntryDto)
  recipes: RecipeEntryDto[];

  @ApiProperty()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @Type(() => Date)
  updatedAt: Date;
}
