import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsArray } from "class-validator";

export class UpdateAuthorProfileDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  expertise?: string[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    website?: string;
    youtube?: string;
    facebook?: string;
  };

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  notificationPreferences?: {
    email?: boolean;
    push?: boolean;
    marketing?: boolean;
  };
}
