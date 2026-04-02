import { Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

import { StatusCode } from "@/common/enums/status-code.enum";
import { buildResponse } from "@/common/utils/response.util";

@Catch()
export class HttpExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = "Internal Server Error";
    let code = StatusCode.INTERNAL_SERVER_ERROR;

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
            : res.message ?? message
          : res;

      const statusCode = exception.getStatus().toString();
      code = Object.values(StatusCode).includes(statusCode as StatusCode)
        ? (statusCode as StatusCode)
        : StatusCode.INTERNAL_SERVER_ERROR;
    }

    response.status(HttpStatus.OK).json(
      buildResponse({
        code,
        message,
        data: null,
      }),
    );
  }
}
