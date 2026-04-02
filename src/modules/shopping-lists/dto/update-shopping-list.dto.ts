import { OmitType, PartialType } from "@nestjs/swagger";
import { ShoppingListDto } from "./shopping-list.dto";

export class UpdateShoppingListDto extends PartialType(
  OmitType(ShoppingListDto, ["id", "userId", "createdAt"] as const),
) {}
