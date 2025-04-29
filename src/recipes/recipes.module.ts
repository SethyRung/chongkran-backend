import { Module } from "@nestjs/common";
import { RecipesController } from "./recipes.controller";
import { RecipesService } from "./recipes.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Recipe, RecipeSchema } from "./schemas/recipe.schema";
import { User, UserSchema } from "src/user/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recipe.name, schema: RecipeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
