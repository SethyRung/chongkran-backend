import { OmitType } from "@nestjs/swagger";
import { CategoryDto } from "./category.dto";

export class UpdateCategoryDto extends OmitType(CategoryDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}
