import { randomUUID } from "crypto";
import { Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

import { ApiResponseCode } from "@/common/types/api-response";

const mapHttpStatusToApiResponseCode = (status: number): ApiResponseCode => {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return ApiResponseCode.InvalidRequest;
    case HttpStatus.UNAUTHORIZED:
      return ApiResponseCode.Unauthorized;
    case HttpStatus.FORBIDDEN:
      return ApiResponseCode.Forbidden;
    case HttpStatus.NOT_FOUND:
      return ApiResponseCode.NotFound;
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return ApiResponseCode.ValidationError;
    default:
      return ApiResponseCode.InternalError;
  }
};

@Catch()
export class HttpExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = "Internal Server Error";
    let code = ApiResponseCode.InternalError;

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as
        | string
        | {
            message?: string | string[];
          };

      message =
        typeof res === "object"
          ? Array.isArray(res.message)
            ? res.message.join(", ")
            : (res.message ?? message)
          : res;

      code = mapHttpStatusToApiResponseCode(exception.getStatus());
    }

    response.status(HttpStatus.OK).json({
      status: {
        code,
        message,
        requestId: randomUUID(),
        requestTime: Date.now(),
      },
      data: null,
    });
  }
}
