import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { DatabaseModule } from "@/db/database.module";
import { validateEnv } from "@/config/env.validation";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
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
import { AdminModule } from "@/modules/admin/admin.module";

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
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
