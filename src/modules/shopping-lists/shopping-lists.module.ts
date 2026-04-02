import { Module } from "@nestjs/common";
import { ShoppingListsService } from "./shopping-lists.service";
import { ShoppingListsController } from "./shopping-lists.controller";
import { SHOPPING_LIST_MODEL } from "@/db/model-definitions";
import { registerMongooseSchemas } from "@/db/register-mongoose-schemas";

@Module({
  imports: [registerMongooseSchemas(SHOPPING_LIST_MODEL)],
  controllers: [ShoppingListsController],
  providers: [ShoppingListsService],
})
export class ShoppingListsModule {}
