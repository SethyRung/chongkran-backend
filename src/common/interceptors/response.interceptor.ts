import { randomUUID } from "crypto";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse, ApiResponseCode } from "@/common/types/api-response";
import { PAGINATED_MARKER } from "@/dto/paginated-response.dto";

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

        const status = {
          code: ApiResponseCode.Success,
          message: "Success",
          requestId: randomUUID(),
          requestTime: Date.now(),
        };

        if (data && typeof data === "object" && PAGINATED_MARKER in data) {
          return {
            status,
            data: data.data,
            meta: data.meta,
          };
        }

        return {
          status,
          data,
        };
      }),
    );
  }
}
