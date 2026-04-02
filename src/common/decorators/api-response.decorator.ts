import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

import { StatusCode } from "../enums/status-code.enum";

type ApiResponseOptions<TModel> = {
  type: TModel;
  isArray?: boolean;
};

type ApiResponseInput<TModel> = TModel | ApiResponseOptions<TModel>;

const PRIMITIVE_MAP = new Map<any, string>([
  [String, "string"],
  [Number, "number"],
  [Boolean, "boolean"],
  [Date, "string"],
]);

const REQUEST_ID_EXAMPLE = "550e8400-e29b-41d4-a716-446655440000";
const REQUEST_TIME_EXAMPLE = 1774426801182;

const resolveOptions = <TModel extends Type<any>>(input: ApiResponseInput<TModel>) => {
  if (typeof input === "function") {
    return { type: input, isArray: false };
  }

  return input;
};

const getPrimitiveSchema = (type: any) => {
  if (type === Date) {
    return {
      type: "string",
      format: "date-time",
      example: new Date(REQUEST_TIME_EXAMPLE).toISOString(),
    };
  }

  return { type: PRIMITIVE_MAP.get(type) };
};

const buildStatusSchema = () => ({
  type: "object",
  properties: {
    code: {
      type: "string",
      enum: Object.values(StatusCode),
      example: StatusCode.OK,
    },
    message: {
      type: "string",
      example: "Success",
    },
    requestId: {
      type: "string",
      format: "uuid",
      example: REQUEST_ID_EXAMPLE,
    },
    requestTime: {
      type: "number",
      example: REQUEST_TIME_EXAMPLE,
    },
  },
});

const buildDataSchema = (type: any, isArray?: boolean) => {
  const isPrimitive = PRIMITIVE_MAP.has(type);

  if (isPrimitive) {
    const primitiveSchema = getPrimitiveSchema(type);

    return isArray
      ? {
          type: "array",
          items: primitiveSchema,
        }
      : primitiveSchema;
  }

  return isArray
    ? {
        type: "array",
        items: { $ref: getSchemaPath(type) },
      }
    : { $ref: getSchemaPath(type) };
};

export function ApiOkResponseWrapper<TModel extends Type<any>>(
  input: ApiResponseInput<TModel>,
): MethodDecorator {
  const { type, isArray } = resolveOptions(input);
  const isPrimitive = PRIMITIVE_MAP.has(type);

  return applyDecorators(
    ...(isPrimitive ? [] : [ApiExtraModels(type)]),
    ApiOkResponse({
      schema: {
        properties: {
          status: buildStatusSchema(),
          data: buildDataSchema(type, isArray),
        },
      },
    }),
  );
}

export function ApiOkResponsePaginated<TModel extends Type<any>>(
  input: ApiResponseInput<TModel>,
): MethodDecorator {
  const { type } = resolveOptions(input);
  const isPrimitive = PRIMITIVE_MAP.has(type);

  const itemSchema = isPrimitive ? getPrimitiveSchema(type) : { $ref: getSchemaPath(type) };

  return applyDecorators(
    ...(isPrimitive ? [] : [ApiExtraModels(type)]),
    ApiOkResponse({
      schema: {
        properties: {
          status: buildStatusSchema(),
          data: {
            type: "object",
            properties: {
              content: {
                type: "array",
                items: itemSchema,
              },
              total: {
                type: "number",
                example: 100,
              },
              page: {
                type: "number",
                example: 1,
              },
              lastPage: {
                type: "number",
                example: 10,
              },
            },
          },
        },
      },
    }),
  );
}

export const ApiResponse = ApiOkResponseWrapper;
export const ApiPaginatedResponse = ApiOkResponsePaginated;
