import { Module } from "@nestjs/common";
import { FollowService } from "./follow.service";
import { FollowController } from "./follow.controller";
import { FOLLOW_MODEL, USER_MODEL } from "@/db/model-definitions";
import { registerMongooseSchemas } from "@/db/register-mongoose-schemas";

@Module({
  imports: [registerMongooseSchemas(FOLLOW_MODEL, USER_MODEL)],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
