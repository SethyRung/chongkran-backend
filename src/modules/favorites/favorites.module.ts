import { Module } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { FavoritesController } from "./favorites.controller";
import { FAVORITE_MODEL } from "@/db/model-definitions";
import { registerMongooseSchemas } from "@/db/register-mongoose-schemas";

@Module({
  imports: [registerMongooseSchemas(FAVORITE_MODEL)],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
