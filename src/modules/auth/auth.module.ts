import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AtStrategy, RtStrategy } from "./strategies";
import { USER_MODEL } from "@/db/model-definitions";
import { registerMongooseSchemas } from "@/db/register-mongoose-schemas";

@Module({
  imports: [registerMongooseSchemas(USER_MODEL), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
