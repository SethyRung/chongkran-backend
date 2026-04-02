import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { RecipesService } from "./recipes.service";
import { RecipeDto } from "./dto/recipe.dto";
import { CreateRecipeDto } from "./dto/create_recipe.dto";
import { Role } from "@/common/enums/role.enum";
import { Roles } from "@/common/decorators/roles.decorator";
import {
  ApiOkResponsePaginated,
  ApiOkResponseWrapper,
  GetCurrentUserId,
  Public,
} from "@/common/decorators";
import { UpdateRecipeDto } from "./dto/update_recipe.dto";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";

@ApiTags("Recipes")
@Controller("/api/recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Public()
  @Get()
  @ApiOkResponsePaginated({ type: RecipeDto })
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.recipesService.findAll(paginationQuery);
  }

  @ApiBearerAuth()
  @Get("/my")
  @ApiOkResponseWrapper({ type: RecipeDto, isArray: true })
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
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.recipesService.findMy(userId, status, paginationQuery);
  }

  @ApiBearerAuth()
  @Get("/pending")
  @Roles(Role.Admin)
  @ApiOkResponseWrapper({ type: RecipeDto, isArray: true })
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  async findPending(@Query() paginationQuery: PaginationQueryDto) {
    return this.recipesService.findPending(paginationQuery);
  }

  @Public()
  @Get("/:id")
  @ApiOkResponseWrapper({ type: RecipeDto })
  async findById(@Param("id") id: string) {
    return this.recipesService.findById(id);
  }

  @ApiBearerAuth()
  @Post()
  @ApiOkResponseWrapper({ type: RecipeDto })
  async create(@GetCurrentUserId() userId: string, @Body() createRecipe: CreateRecipeDto) {
    return this.recipesService.create(userId, createRecipe);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Put("/update-status")
  @ApiQuery({ name: "id", type: String })
  @ApiQuery({ name: "status", enum: ["pending", "approved", "rejected"] })
  @ApiOkResponseWrapper({ type: RecipeDto })
  async updateStatus(@Query("id") id: string, @Query("status") status: RecipeDto["status"]) {
    return this.recipesService.updateStatus(id, status);
  }

  @ApiBearerAuth()
  @Patch("/:id")
  @ApiOkResponseWrapper({ type: RecipeDto })
  async update(
    @Param("id") id: string,
    @GetCurrentUserId() userId,
    @Body() updateRecipe: UpdateRecipeDto,
  ) {
    return this.recipesService.update(userId, id, updateRecipe);
  }

  @ApiBearerAuth()
  @Delete("/:id")
  @ApiOkResponseWrapper({ type: String })
  async delete(@Param("id") id: string, @GetCurrentUserId() userId: string) {
    return this.recipesService.delete(id, userId);
  }

  @ApiBearerAuth()
  @Put("/:id/like")
  @ApiOkResponseWrapper({ type: String })
  async likeRecipe(@Param("id") id: string, @GetCurrentUserId() userid) {
    return this.recipesService.likeRecipe(id, userid);
  }

  @Put("/:id/view")
  @ApiOkResponseWrapper({ type: String })
  async viewRecipe(@Param("id") id: string) {
    return this.recipesService.incrementViews(id);
  }

  @Public()
  @Get("/author/:authorId")
  @ApiOkResponsePaginated({ type: RecipeDto })
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  async findByAuthor(
    @Param("authorId") authorId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.recipesService.findByAuthor(authorId, paginationQuery);
  }

  @Public()
  @Get("/author/:authorId/popular")
  @ApiOkResponseWrapper({ type: RecipeDto, isArray: true })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 5 })
  async getPopularRecipesByAuthor(
    @Param("authorId") authorId: string,
    @Query("limit") limit: number = 5,
  ) {
    return this.recipesService.getPopularRecipesByAuthor(authorId, limit);
  }

  @Public()
  @Get("/author/:authorId/recent")
  @ApiOkResponseWrapper({ type: RecipeDto, isArray: true })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 5 })
  async getRecentRecipesByAuthor(
    @Param("authorId") authorId: string,
    @Query("limit") limit: number = 5,
  ) {
    return this.recipesService.getRecentRecipesByAuthor(authorId, limit);
  }

  @Public()
  @Get("/:id/with-author")
  @ApiOkResponseWrapper({ type: RecipeDto })
  async findByIdWithAuthor(@Param("id") id: string) {
    return this.recipesService.findByIdWithAuthor(id);
  }
}
