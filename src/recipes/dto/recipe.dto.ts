import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { IngredientDto } from "./ingredient.dto";

export class RecipeDto {
  @ApiProperty()
  @IsMongoId()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [IngredientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  steps: string[];

  @ApiProperty()
  @IsMongoId()
  author: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsNumber()
  cookTime: number;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  likes?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  views?: number;

  @ApiProperty({ enum: ["easy", "medium", "hard"] })
  @IsEnum(["easy", "medium", "hard"])
  difficulty: "easy" | "medium" | "hard";

  @ApiProperty({
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  })
  @IsEnum(["pending", "approved", "rejected"])
  @IsOptional()
  status?: "pending" | "approved" | "rejected";

  @ApiProperty()
  @IsMongoId()
  category: string;

  @ApiProperty()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @Type(() => Date)
  updatedAt: Date;
}
