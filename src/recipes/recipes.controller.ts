import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

@ApiTags("Recipes")
@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiBearerAuth()
  @Get()
  @ApiOkResponse({ type: RecipeDto, isArray: true })
  async findAll(): Promise<RecipeDto[]> {
    return this.recipesService.findAll();
  }

  @ApiBearerAuth()
  @Get("/:id")
  @ApiOkResponse({ type: RecipeDto })
  async findById(@Param("id") id: string): Promise<RecipeDto> {
    return this.recipesService.findById(id);
  }

  @ApiBearerAuth()
  @Post()
  @ApiOkResponse({ type: RecipeDto })
  async create(@Body() createRecipe: CreateRecipeDto): Promise<RecipeDto> {
    return await this.recipesService.create(createRecipe);
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
}
