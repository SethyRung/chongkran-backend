import {
  IsMongoId,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ShoppingItemDto } from "./shopping-item.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ShoppingListDto {
  @ApiProperty()
  @IsMongoId()
  id: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: [ShoppingItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShoppingItemDto)
  items: ShoppingItemDto[];

  @ApiProperty()
  @Type(() => Date)
  createdAt: Date;
}
