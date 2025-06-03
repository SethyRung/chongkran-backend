import { ApiProperty } from "@nestjs/swagger";
import { StatusDto } from "./status.dto";

export class BaseResponseDto<T> {
  @ApiProperty({ type: () => StatusDto })
  status: StatusDto;

  @ApiProperty({ type: () => Object })
  data: T;
}
