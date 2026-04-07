import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { CATEGORY_MODEL } from "@/db/model-definitions";
import { registerMongooseSchemas } from "@/db/register-mongoose-schemas";

@Module({
  imports: [registerMongooseSchemas(CATEGORY_MODEL)],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
