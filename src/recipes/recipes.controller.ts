import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { RecipesService } from "./recipes.service";
import { RecipeDto } from "./dto/recipe.dto";
import { CreateRecipeDto } from "./dto/create_recipe.dto";

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
  @Post()
  @ApiOkResponse({ type: RecipeDto })
  async create(@Body() createRecipe: CreateRecipeDto): Promise<RecipeDto> {
    return await this.recipesService.create(createRecipe);
  }
}
