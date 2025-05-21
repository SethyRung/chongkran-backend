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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { RecipesService } from "./recipes.service";
import { RecipeDto } from "./dto/recipe.dto";
import { CreateRecipeDto } from "./dto/create_recipe.dto";
import { Role } from "src/common/enums/role.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import { GetCurrentUserId, Public } from "src/common/decorators";
import { UpdateRecipeDto } from "./dto/update_recipe.dto";
import { PaginationQueryDto } from "src/dto/pagination-query.dto";
import { PaginatedResponseDto } from "src/dto/paginated-response.dto";

@ApiTags("Recipes")
@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Public()
  @Get()
  @ApiOkResponse({ type: RecipeDto, isArray: true })
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<RecipeDto>> {
    return this.recipesService.findAll(paginationQuery);
  }

  @ApiBearerAuth()
  @Get("/my")
  @ApiOkResponse({ type: RecipeDto, isArray: true })
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
  ): Promise<PaginatedResponseDto<RecipeDto>> {
    return this.recipesService.findMy(userId, status, paginationQuery);
  }

  @ApiBearerAuth()
  @Get("/pending")
  @Roles(Role.Admin)
  @ApiOkResponse({ type: RecipeDto, isArray: true })
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  async findPending(
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<RecipeDto>> {
    return this.recipesService.findPending(paginationQuery);
  }

  @Public()
  @Get("/:id")
  @ApiOkResponse({ type: RecipeDto })
  async findById(@Param("id") id: string): Promise<RecipeDto> {
    return this.recipesService.findById(id);
  }

  @ApiBearerAuth()
  @Post()
  @ApiOkResponse({ type: RecipeDto })
  async create(
    @GetCurrentUserId() userId: string,
    @Body() createRecipe: CreateRecipeDto
  ): Promise<RecipeDto> {
    return await this.recipesService.create(userId, createRecipe);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Put("/update-status")
  @ApiQuery({ name: "id", type: String })
  @ApiQuery({ name: "status", enum: ["pending", "approved", "rejected"] })
  @ApiOkResponse({ type: RecipeDto })
  async updateStatus(
    @Query("id") id: string,
    @Query("status") status: RecipeDto["status"]
  ): Promise<RecipeDto> {
    return await this.recipesService.updateStatus(id, status);
  }

  @ApiBearerAuth()
  @Patch("/:id")
  async update(
    @Param("id") id: string,
    @GetCurrentUserId() userId,
    @Body() updateRecipe: UpdateRecipeDto
  ): Promise<RecipeDto> {
    return await this.recipesService.update(userId, id, updateRecipe);
  }

  @ApiBearerAuth()
  @Delete("/:id")
  @ApiOkResponse({ type: String })
  async delete(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string
  ): Promise<string> {
    return await this.recipesService.delete(id, userId);
  }

  @ApiBearerAuth()
  @Put("/:id/like")
  async likeRecipe(@Param("id") id: string, @GetCurrentUserId() userid) {
    return await this.recipesService.likeRecipe(id, userid);
  }

  @Put("/:id/view")
  viewRecipe(@Param("id") id: string) {
    return this.recipesService.incrementViews(id);
  }
}
