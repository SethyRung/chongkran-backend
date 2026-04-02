import { DynamicModule } from "@nestjs/common";
import { MongooseModule, type ModelDefinition } from "@nestjs/mongoose";

export const registerMongooseSchemas = (...models: ModelDefinition[]): DynamicModule =>
  MongooseModule.forFeature(models);
