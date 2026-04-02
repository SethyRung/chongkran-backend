import { randomUUID } from "crypto";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { StatusCode } from "@/common/enums/status-code.enum";

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

        return {
          status: {
            code: StatusCode.OK,
            message: "Success",
            requestId: randomUUID(),
            requestTime: Date.now(),
          },
          data,
        };
      }),
    );
  }
}
