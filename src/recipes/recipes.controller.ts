import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { RecipesService } from "./recipes.service";
import { RecipeDto } from "./dto/recipe.dto";
import { CreateRecipeDto } from "./dto/create_recipe.dto";
import { Role } from "src/common/enums/role.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import {
  ApiPaginatedResponse,
  ApiResponse,
  GetCurrentUserId,
  Public,
} from "src/common/decorators";
import { UpdateRecipeDto } from "./dto/update_recipe.dto";
import { PaginationQueryDto } from "src/dto/pagination-query.dto";
import { buildResponse } from "src/common/utils/response.util";

@ApiTags("Recipes")
@Controller("/api/recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Public()
  @Get()
  @ApiPaginatedResponse({ type: RecipeDto })
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return buildResponse({
      data: await this.recipesService.findAll(paginationQuery),
    });
  }

  @ApiBearerAuth()
  @Get("/my")
  @ApiResponse({ type: RecipeDto, isArray: true })
  @ApiQuery({
    name: "status",
    enum: ["all", "pending", "approved", "rejected"],
    required: false,
    default: "all",
  })
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  async findMy(
    @GetCurrentUserId() userId: string,
    @Query("status") status: RecipeDto["status"] & "all",
    @Query() paginationQuery: PaginationQueryDto
  ) {
    return buildResponse({
      data: await this.recipesService.findMy(userId, status, paginationQuery),
    });
  }

  @ApiBearerAuth()
  @Get("/pending")
  @Roles(Role.Admin)
  @ApiResponse({ type: RecipeDto, isArray: true })
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  async findPending(@Query() paginationQuery: PaginationQueryDto) {
    return buildResponse({
      data: await this.recipesService.findPending(paginationQuery),
    });
  }

  @Public()
  @Get("/:id")
  @ApiResponse({ type: RecipeDto })
  async findById(@Param("id") id: string) {
    return buildResponse({ data: await this.recipesService.findById(id) });
  }

  @ApiBearerAuth()
  @Post()
  @ApiResponse({ type: RecipeDto })
  async create(
    @GetCurrentUserId() userId: string,
    @Body() createRecipe: CreateRecipeDto
  ) {
    return buildResponse({
      data: await this.recipesService.create(userId, createRecipe),
    });
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Put("/update-status")
  @ApiQuery({ name: "id", type: String })
  @ApiQuery({ name: "status", enum: ["pending", "approved", "rejected"] })
  @ApiResponse({ type: RecipeDto })
  async updateStatus(
    @Query("id") id: string,
    @Query("status") status: RecipeDto["status"]
  ) {
    return buildResponse({
      data: await this.recipesService.updateStatus(id, status),
    });
  }

  @ApiBearerAuth()
  @Patch("/:id")
  @ApiResponse({ type: RecipeDto })
  async update(
    @Param("id") id: string,
    @GetCurrentUserId() userId,
    @Body() updateRecipe: UpdateRecipeDto
  ) {
    return buildResponse({
      data: await this.recipesService.update(userId, id, updateRecipe),
    });
  }

  @ApiBearerAuth()
  @Delete("/:id")
  @ApiResponse({ type: String })
  async delete(@Param("id") id: string, @GetCurrentUserId() userId: string) {
    return buildResponse({
      data: await this.recipesService.delete(id, userId),
    });
  }

  @ApiBearerAuth()
  @Put("/:id/like")
  @ApiResponse({ type: String })
  async likeRecipe(@Param("id") id: string, @GetCurrentUserId() userid) {
    return buildResponse({
      data: await this.recipesService.likeRecipe(id, userid),
    });
  }

  @Put("/:id/view")
  @ApiResponse({ type: String })
  async viewRecipe(@Param("id") id: string) {
    return buildResponse({
      data: await this.recipesService.incrementViews(id),
    });
  }
}
