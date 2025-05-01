import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class FavoriteDto {
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
  @Type(() => Date)
  createdAt: Date;
}
