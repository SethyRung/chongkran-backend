import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMealPlanDto } from "./dto/create-meal-plan.dto";
import { UpdateMealPlanDto } from "./dto/update-meal-plan.dto";
import { MealPlanDto } from "./dto/meal-plan.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MealPlan, MealPlanDocument } from "@/db/schema/meal-plan.schema";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";
import { PaginatedResponseDto } from "@/dto/paginated-response.dto";

@Injectable()
export class MealPlansService {
  constructor(@InjectModel(MealPlan.name) private mealPlanModel: Model<MealPlanDocument>) {}

  async create(userId: string, createMealPlanDto: CreateMealPlanDto): Promise<MealPlanDto> {
    const created = await this.mealPlanModel.create({
      ...createMealPlanDto,
      userId: new Types.ObjectId(userId),
      recipes: createMealPlanDto.recipes.map((r) => ({
        recipeId: new Types.ObjectId(r.recipeId),
        day: r.day,
        mealType: r.mealType,
      })),
    });

    return {
      ...created.toJSON(),
      userId,
      recipes: created.recipes.map((recipe) => ({
        recipeId: recipe.recipeId.toString(),
        day: recipe.day,
        mealType: recipe.mealType,
      })),
    } as unknown as MealPlanDto;
  }

  async findAll(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<MealPlanDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;
    const userObjectId = new Types.ObjectId(userId);

    const [mealPlans, total] = await Promise.all([
      this.mealPlanModel.find({ userId: userObjectId }).skip(offset).limit(limit).exec(),
      this.mealPlanModel.countDocuments({ userId: userObjectId }).exec(),
    ]);

    const data = mealPlans.map((mealPlan) => ({
      ...mealPlan.toJSON(),
      userId,
      recipes: mealPlan.recipes.map((recipe) => ({
        recipeId: recipe.recipeId.toString(),
        day: recipe.day,
        mealType: recipe.mealType,
      })),
    })) as unknown as MealPlanDto[];

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async findOne(id: string, userId: string): Promise<MealPlanDto> {
    const mealPlan = await this.mealPlanModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();

    if (!mealPlan) throw new NotFoundException("Plan not found.");

    return {
      ...mealPlan.toJSON(),
      userId,
      recipes: mealPlan.recipes.map((recipe) => ({
        recipeId: recipe.recipeId.toString(),
        day: recipe.day,
        mealType: recipe.mealType,
      })),
    } as unknown as MealPlanDto;
  }

  async update(
    id: string,
    userId: string,
    updateMealPlanDto: UpdateMealPlanDto,
  ): Promise<MealPlanDto> {
    const mealPlan = await this.mealPlanModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();
    if (!mealPlan) throw new NotFoundException("Plan not found");

    Object.assign(mealPlan, { ...updateMealPlanDto });
    const updated = await mealPlan.save();
    return {
      ...updated.toJSON(),
      userId,
      recipes: updated.recipes.map((recipe) => ({
        recipeId: recipe.recipeId.toString(),
        day: recipe.day,
        mealType: recipe.mealType,
      })),
    } as unknown as MealPlanDto;
  }

  async remove(id: string, userId: string): Promise<string> {
    const review = await this.mealPlanModel
      .findById({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();
    if (!review) throw new NotFoundException("Plan not found.");

    await review.deleteOne();
    return "Plan deleted successfully";
  }
}
