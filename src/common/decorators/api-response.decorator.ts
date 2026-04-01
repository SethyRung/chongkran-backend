import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { applyDecorators, Type } from "@nestjs/common";
import { BaseResponseDto } from "@/dto/base-response.dto";

type ApiResponseOptions<TModel> = {
  type: TModel;
  isArray?: boolean;
};

const PRIMITIVE_MAP = new Map<any, string>([
  [String, "string"],
  [Number, "number"],
  [Boolean, "boolean"],
]);

export function ApiResponse<TModel extends Type<any>>(
  options: ApiResponseOptions<TModel>,
): MethodDecorator {
  const { type, isArray } = options;

  const isPrimitive = PRIMITIVE_MAP.has(type);
  const primitiveType = PRIMITIVE_MAP.get(type);

  const dataSchema = isPrimitive
    ? isArray
      ? { type: "array", items: { type: primitiveType } }
      : { type: primitiveType }
    : isArray
      ? {
          type: "array",
          items: { $ref: getSchemaPath(type) },
        }
      : {
          type: "object",
          $ref: getSchemaPath(type),
        };

  return applyDecorators(
    ...(isPrimitive ? [] : [ApiExtraModels(BaseResponseDto, type)]),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  );
}
