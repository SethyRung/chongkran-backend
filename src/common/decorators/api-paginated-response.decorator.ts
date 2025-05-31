import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { applyDecorators, Type } from "@nestjs/common";
import { BaseResponseDto } from "src/dto/base-response.dto";
import { PaginatedResponseDto } from "src/dto/paginated-response.dto";

type ApiResponseOptions<TModel> = {
  type: TModel;
};

const PRIMITIVE_MAP = new Map<any, string>([
  [String, "string"],
  [Number, "number"],
  [Boolean, "boolean"],
]);

export function ApiPaginatedResponse<TModel extends Type<any>>(
  options: ApiResponseOptions<TModel>
): MethodDecorator {
  const { type } = options;

  const isPrimitive = PRIMITIVE_MAP.has(type);
  const primitiveType = PRIMITIVE_MAP.get(type);

  const itemsSchema = isPrimitive
    ? { type: primitiveType }
    : { $ref: getSchemaPath(type) };

  return applyDecorators(
    ...(isPrimitive
      ? [ApiExtraModels(BaseResponseDto, PaginatedResponseDto)]
      : [ApiExtraModels(BaseResponseDto, PaginatedResponseDto, type)]),
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
                        items: itemsSchema,
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
