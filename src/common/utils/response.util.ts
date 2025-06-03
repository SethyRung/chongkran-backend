import { BaseResponseDto } from "src/dto/base-response.dto";
import { randomUUID } from "crypto";
import { StatusCode } from "../enums/status-code.enum";

export function buildResponse<T>({
  code = StatusCode.OK,
  message = "",
  data,
}: {
  code?: StatusCode;
  message?: string;
  data: T;
}): BaseResponseDto<T> {
  return {
    status: {
      code,
      message,
      requestId: randomUUID(),
      requestTime: Date.now(),
    },
    data,
  };
}
