import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "./common/guards";
import { RolesGuard } from "./common/guards/roles.guard";
import { DatabaseModule } from "@/db/database.module";
import { validateEnv } from "@/config/env.validation";
import { AuthModule } from "@/modules/auth/auth.module";
import { UserModule } from "@/modules/user/user.module";
import { RecipesModule } from "@/modules/recipes/recipes.module";
import { CategoriesModule } from "@/modules/categories/categories.module";
import { ReviewsModule } from "@/modules/reviews/reviews.module";
import { FavoritesModule } from "@/modules/favorites/favorites.module";
import { MealPlansModule } from "@/modules/meal-plans/meal-plans.module";
import { ShoppingListsModule } from "@/modules/shopping-lists/shopping-lists.module";
import { UploadModule } from "@/modules/upload/upload.module";
import { FollowModule } from "@/modules/follows/follow.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    RecipesModule,
    CategoriesModule,
    ReviewsModule,
    FavoritesModule,
    MealPlansModule,
    ShoppingListsModule,
    UploadModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
