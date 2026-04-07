import { Module } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { REVIEW_MODEL, USER_MODEL } from "@/db/model-definitions";
import { registerMongooseSchemas } from "@/db/register-mongoose-schemas";

@Module({
  imports: [registerMongooseSchemas(REVIEW_MODEL, USER_MODEL)],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
