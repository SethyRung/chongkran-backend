import { Module } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { RECIPE_MODEL, USER_MODEL } from "@/db/model-definitions";
import { registerMongooseSchemas } from "@/db/register-mongoose-schemas";

@Module({
  imports: [registerMongooseSchemas(RECIPE_MODEL, USER_MODEL)],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
