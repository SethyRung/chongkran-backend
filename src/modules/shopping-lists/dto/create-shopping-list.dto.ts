import { OmitType } from "@nestjs/swagger";
import { ShoppingListDto } from "./shopping-list.dto";

export class CreateShoppingListDto extends OmitType(ShoppingListDto, [
  "id",
  "userId",
  "createdAt",
] as const) {}
