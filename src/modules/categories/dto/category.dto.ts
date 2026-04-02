import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CategoryDto {
  @ApiProperty()
  @IsMongoId()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @Type(() => Date)
  updatedAt: Date;
}
