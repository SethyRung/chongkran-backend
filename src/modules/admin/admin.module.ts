import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { RECIPE_MODEL, USER_MODEL } from "@/db/model-definitions";
import { registerMongooseSchemas } from "@/db/register-mongoose-schemas";

@Module({
  imports: [registerMongooseSchemas(USER_MODEL, RECIPE_MODEL)],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
