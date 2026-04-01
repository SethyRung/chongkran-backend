import { Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Response } from "express";
import { BaseResponseDto } from "@/dto/base-response.dto";
import { buildResponse } from "../utils/response.util";
import { StatusCode } from "../enums/status-code.enum";
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as
        | string
        | {
            message: string[];
            error: string;
            statusCode: number;
          };
      const message =
        typeof res === "object"
          ? Array.isArray(res.message)
            ? res.message.join(", ")
            : res.message
          : res;

      const statusCode = exception.getStatus().toString();

      const data: BaseResponseDto<null> = buildResponse({
        code: Object.values(StatusCode).includes(statusCode as StatusCode)
          ? (statusCode as StatusCode)
          : StatusCode.INTERNAL_SERVER_ERROR,
        message: message,
        data: null,
      });

      response.status(HttpStatus.OK).json(data);
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json("Internal Server Error");
    }

    super.catch(exception, host);
  }
}
