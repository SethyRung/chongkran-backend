import { ApiProperty } from "@nestjs/swagger";

export class UploadDto {
  @ApiProperty()
  public_id: string;

  @ApiProperty()
  url: string;
}
