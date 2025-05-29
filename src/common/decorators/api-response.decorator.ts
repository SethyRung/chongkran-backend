import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { applyDecorators, Type } from "@nestjs/common";
import { BaseResponseDto } from "src/dto/base-response.dto";

type ApiResponseOptions<TModel> = {
  type: TModel;
  isArray?: boolean | undefined;
};

export function ApiResponse<TModel extends Type<any>>(
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
              data: options.isArray
                ? {
                    type: "array",
                    items: { $ref: getSchemaPath(options.type) },
                  }
                : {
                    type: "object",
                    $ref: getSchemaPath(options.type),
                  },
            },
          },
        ],
      },
    })
  );
}
