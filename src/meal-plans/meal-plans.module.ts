import { Module } from "@nestjs/common";
import { MealPlansService } from "./meal-plans.service";
import { MealPlansController } from "./meal-plans.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { MealPlan, MealPlanSchema } from "./schemas/meal-plan.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: MealPlan.name, schema: MealPlanSchema }])],
  controllers: [MealPlansController],
  providers: [MealPlansService],
})
export class MealPlansModule {}
