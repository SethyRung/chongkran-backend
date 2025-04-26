import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class IngredientDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  quantity: string;
}
