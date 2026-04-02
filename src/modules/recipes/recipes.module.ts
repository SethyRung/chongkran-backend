import { Module } from "@nestjs/common";
import { RecipesController } from "./recipes.controller";
import { RecipesService } from "./recipes.service";
import { RECIPE_MODEL, USER_MODEL } from "@/db/model-definitions";
import { registerMongooseSchemas } from "@/db/register-mongoose-schemas";

@Module({
  imports: [registerMongooseSchemas(RECIPE_MODEL, USER_MODEL)],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
