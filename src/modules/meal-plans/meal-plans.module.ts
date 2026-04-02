import { Module } from "@nestjs/common";
import { MealPlansService } from "./meal-plans.service";
import { MealPlansController } from "./meal-plans.controller";
import { MEAL_PLAN_MODEL } from "@/db/model-definitions";
import { registerMongooseSchemas } from "@/db/register-mongoose-schemas";

@Module({
  imports: [registerMongooseSchemas(MEAL_PLAN_MODEL)],
  controllers: [MealPlansController],
  providers: [MealPlansService],
})
export class MealPlansModule {}
