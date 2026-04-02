import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { StatusCode } from "@/common/enums/status-code.enum";
import { buildResponse } from "@/common/utils/response.util";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (
          data &&
          typeof data === "object" &&
          "status" in data &&
          typeof data.status === "object" &&
          data.status !== null &&
          "requestId" in data.status
        ) {
          return data;
        }

        return buildResponse({
          code: StatusCode.OK,
          message: "Success",
          data,
        });
      }),
    );
  }
}
