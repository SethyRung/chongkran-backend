import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AUTHOR_REQUEST_MODEL, RECIPE_MODEL, USER_MODEL } from "@/db/model-definitions";
import { registerMongooseSchemas } from "@/db/register-mongoose-schemas";

@Module({
  imports: [registerMongooseSchemas(USER_MODEL, AUTHOR_REQUEST_MODEL, RECIPE_MODEL)],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
