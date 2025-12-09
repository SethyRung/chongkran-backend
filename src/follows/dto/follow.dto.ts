import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsMongoId } from "class-validator";

export class FollowDto {
  @ApiProperty({ example: "507f1f77bcf86cd799439011" })
  @IsNotEmpty()
  @IsMongoId()
  followingId: string;
}

export class UnfollowDto {
  @ApiProperty({ example: "507f1f77bcf86cd799439011" })
  @IsNotEmpty()
  @IsMongoId()
  followingId: string;
}