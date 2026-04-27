import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

class AuthorRequestUserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  avatar?: string;
}

export class AuthorRequestResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: AuthorRequestUserDto })
  @Type(() => AuthorRequestUserDto)
  @Expose()
  user: AuthorRequestUserDto;

  @ApiProperty({ enum: ["pending", "approved", "rejected"] })
  @Expose()
  status: "pending" | "approved" | "rejected";
}
