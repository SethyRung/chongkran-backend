import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { MealPlansService } from "./meal-plans.service";
import { CreateMealPlanDto } from "./dto/create-meal-plan.dto";
import { UpdateMealPlanDto } from "./dto/update-meal-plan.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MealPlanDto } from "./dto/meal-plan.dto";
import { ApiPaginatedResponse, ApiResponse, GetCurrentUserId } from "@/common/decorators";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";

@ApiTags("Meal-Plans")
@Controller("/api/meal-plans")
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @ApiBearerAuth()
  @Post()
  @ApiResponse({ type: MealPlanDto })
  async create(@GetCurrentUserId() userId: string, @Body() createMealPlanDto: CreateMealPlanDto) {
    return this.mealPlansService.create(userId, createMealPlanDto);
  }

  @ApiBearerAuth()
  @Get()
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  @ApiPaginatedResponse({ type: MealPlanDto })
  async findAll(@GetCurrentUserId() userId: string, @Query() paginationQuery: PaginationQueryDto) {
    return this.mealPlansService.findAll(userId, paginationQuery);
  }

  @ApiBearerAuth()
  @Get(":id")
  @ApiResponse({ type: MealPlanDto })
  async findOne(@Param("id") id: string, @GetCurrentUserId() userId: string) {
    return this.mealPlansService.findOne(id, userId);
  }

  @ApiBearerAuth()
  @Patch(":id")
  @ApiResponse({ type: MealPlanDto })
  async update(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateMealPlanDto: UpdateMealPlanDto,
  ) {
    return this.mealPlansService.update(id, userId, updateMealPlanDto);
  }

  @ApiBearerAuth()
  @Delete(":id")
  @ApiResponse({ type: String })
  async remove(@Param("id") id: string, @GetCurrentUserId() userId: string) {
    return this.mealPlansService.remove(id, userId);
  }
}
