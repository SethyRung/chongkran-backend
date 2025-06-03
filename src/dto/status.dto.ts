import { ApiProperty } from "@nestjs/swagger";

export class StatusDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  requestId: string;

  @ApiProperty()
  requestTime: number;
}
