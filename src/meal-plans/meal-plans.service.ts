import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMealPlanDto } from "./dto/create-meal-plan.dto";
import { UpdateMealPlanDto } from "./dto/update-meal-plan.dto";
import { MealPlanDto } from "./dto/meal-plan.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MealPlan, MealPlanDocument } from "./schemas/meal-plan.schema";

@Injectable()
export class MealPlansService {
  constructor(
    @InjectModel(MealPlan.name) private mealPlanModel: Model<MealPlanDocument>
  ) {}

  async create(
    userId: string,
    createMealPlanDto: CreateMealPlanDto
  ): Promise<MealPlanDto> {
    const created = await this.mealPlanModel.create({
      ...createMealPlanDto,
      userId,
    });

    return {
      id: created.id,
      userId,
      title: created.title,
      recipes: created.recipes.map((recipe) => ({
        recipeId: recipe.recipeId.toString(),
        day: recipe.day,
        mealType: recipe.mealType,
      })),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async findAll(userId: string): Promise<MealPlanDto[]> {
    const mealPlans = await this.mealPlanModel.find({ userId }).exec();
    return mealPlans.map((mealPlan) => ({
      id: mealPlan.id,
      userId,
      title: mealPlan.title,
      recipes: mealPlan.recipes.map((recipe) => ({
        recipeId: recipe.recipeId.toString(),
        day: recipe.day,
        mealType: recipe.mealType,
      })),
      createdAt: mealPlan.createdAt,
      updatedAt: mealPlan.updatedAt,
    }));
  }

  async findOne(id: string, userId: string): Promise<MealPlanDto> {
    const mealPlan = await this.mealPlanModel
      .findOne({ _id: id, userId })
      .exec();

    if (!mealPlan) throw new NotFoundException("Plan not found.");

    return {
      id: mealPlan.id,
      userId,
      title: mealPlan.title,
      recipes: mealPlan.recipes.map((recipe) => ({
        recipeId: recipe.recipeId.toString(),
        day: recipe.day,
        mealType: recipe.mealType,
      })),
      createdAt: mealPlan.createdAt,
      updatedAt: mealPlan.updatedAt,
    };
  }

  async update(
    id: string,
    userId: string,
    updateMealPlanDto: UpdateMealPlanDto
  ): Promise<MealPlanDto> {
    const mealPlan = await this.mealPlanModel
      .findOne({ _id: id, userId })
      .exec();
    if (!mealPlan) throw new NotFoundException("Plan not found");

    Object.assign(mealPlan, { ...updateMealPlanDto });
    const updated = await mealPlan.save();
    return {
      id: updated.id,
      userId,
      title: updated.title,
      recipes: updated.recipes.map((recipe) => ({
        recipeId: recipe.recipeId.toString(),
        day: recipe.day,
        mealType: recipe.mealType,
      })),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async remove(id: string, userId: string): Promise<string> {
    const review = await this.mealPlanModel
      .findById({ _id: id, userId })
      .exec();
    if (!review) throw new NotFoundException("Plan not found.");

    await review.deleteOne();
    return "Plan deleted successfully";
  }
}
