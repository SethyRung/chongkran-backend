import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { MealPlansService } from "./meal-plans.service";
import { CreateMealPlanDto } from "./dto/create-meal-plan.dto";
import { UpdateMealPlanDto } from "./dto/update-meal-plan.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MealPlanDto } from "./dto/meal-plan.dto";
import {
  ApiOkResponsePaginated,
  ApiOkResponseWrapper,
  GetCurrentUserId,
} from "@/common/decorators";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";

@ApiTags("Meal-Plans")
@Controller("/api/meal-plans")
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOkResponseWrapper({ type: MealPlanDto })
  async create(@GetCurrentUserId() userId: string, @Body() createMealPlanDto: CreateMealPlanDto) {
    return this.mealPlansService.create(userId, createMealPlanDto);
  }

  @ApiBearerAuth()
  @Get()

  @ApiOkResponsePaginated({ type: MealPlanDto })
  async findAll(@GetCurrentUserId() userId: string, @Query() paginationQuery: PaginationQueryDto) {
    return this.mealPlansService.findAll(userId, paginationQuery);
  }

  @ApiBearerAuth()
  @Get(":id")
  @ApiOkResponseWrapper({ type: MealPlanDto })
  async findOne(@Param("id") id: string, @GetCurrentUserId() userId: string) {
    return this.mealPlansService.findOne(id, userId);
  }

  @ApiBearerAuth()
  @Patch(":id")
  @ApiOkResponseWrapper({ type: MealPlanDto })
  async update(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateMealPlanDto: UpdateMealPlanDto,
  ) {
    return this.mealPlansService.update(id, userId, updateMealPlanDto);
  }

  @ApiBearerAuth()
  @Delete(":id")
  @ApiOkResponseWrapper({ type: String })
  async remove(@Param("id") id: string, @GetCurrentUserId() userId: string) {
    return this.mealPlansService.remove(id, userId);
  }
}
