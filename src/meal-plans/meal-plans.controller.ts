import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { MealPlansService } from "./meal-plans.service";
import { CreateMealPlanDto } from "./dto/create-meal-plan.dto";
import { UpdateMealPlanDto } from "./dto/update-meal-plan.dto";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { MealPlanDto } from "./dto/meal-plan.dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Meal-Plans")
@Controller("meal-plans")
export class MealPlansController {
  constructor(private readonly mealPlansService: MealPlansService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOkResponse({ type: MealPlanDto })
  async create(
    @GetCurrentUserId() userId: string,
    @Body() createMealPlanDto: CreateMealPlanDto
  ): Promise<MealPlanDto> {
    return await this.mealPlansService.create(userId, createMealPlanDto);
  }

  @ApiBearerAuth()
  @Get()
  @ApiOkResponse({ type: MealPlanDto, isArray: true })
  async findAll(@GetCurrentUserId() userId: string): Promise<MealPlanDto[]> {
    return await this.mealPlansService.findAll(userId);
  }

  @ApiBearerAuth()
  @Get(":id")
  @ApiOkResponse({ type: MealPlanDto })
  async findOne(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string
  ): Promise<MealPlanDto> {
    return await this.mealPlansService.findOne(id, userId);
  }

  @ApiBearerAuth()
  @Patch(":id")
  @ApiOkResponse({ type: MealPlanDto })
  async update(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateMealPlanDto: UpdateMealPlanDto
  ): Promise<MealPlanDto> {
    return await this.mealPlansService.update(id, userId, updateMealPlanDto);
  }

  @ApiBearerAuth()
  @Delete(":id")
  @ApiOkResponse({ type: String })
  async remove(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string
  ): Promise<string> {
    return await this.mealPlansService.remove(id, userId);
  }
}
