import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { applyDecorators, Type } from "@nestjs/common";
import { BaseResponseDto } from "src/dto/base-response.dto";
import { PaginatedResponseDto } from "src/dto/paginated-response.dto";

type ApiResponseOptions<TModel> = {
  type: TModel;
};

export function ApiPaginatedResponse<TModel extends Type<any>>(
  options: ApiResponseOptions<TModel>
): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto, options.type),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: {
                type: "object",
                allOf: [
                  { $ref: getSchemaPath(PaginatedResponseDto) },
                  {
                    properties: {
                      content: {
                        type: "array",
                        items: { $ref: getSchemaPath(options.type) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    })
  );
}
