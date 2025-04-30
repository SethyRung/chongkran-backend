import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
} from "class-validator";

export class ReviewDto {
  @ApiProperty()
  @IsMongoId()
  id: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  recipeId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  rating: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @Type(() => Date)
  updatedAt: Date;
}
