import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Response } from "express";
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
      const message = typeof res === "object" ? res.message.join(", ") : res;
      response.status(exception.getStatus()).json(message);
    } else {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json("Internal Server Error");
    }

    super.catch(exception, host);
  }
}
