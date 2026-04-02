import { randomUUID } from "crypto";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse, ApiResponseCode } from "@/common/types/api-response";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data): ApiResponse<T> => {
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
            code: ApiResponseCode.Success,
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
