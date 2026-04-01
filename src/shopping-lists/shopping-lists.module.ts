import { Module } from "@nestjs/common";
import { ShoppingListsService } from "./shopping-lists.service";
import { ShoppingListsController } from "./shopping-lists.controller";
import { ShoppingList, ShoppingListSchema } from "./schemas/shopping-list.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([{ name: ShoppingList.name, schema: ShoppingListSchema }])],
  controllers: [ShoppingListsController],
  providers: [ShoppingListsService],
})
export class ShoppingListsModule {}
