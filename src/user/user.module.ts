import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { AuthorRequesSchema, AuthorRequest } from "./schemas/author_request.schema";
import { Recipe, RecipeSchema } from "../recipes/schemas/recipe.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthorRequest.name, schema: AuthorRequesSchema },
      { name: Recipe.name, schema: RecipeSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
