import { Injectable } from "@nestjs/common";
import { RecipeDto } from "./dto/recipe.dto";
import { CreateRecipeDto } from "./dto/create_recipe.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Recipes, RecipesDocument } from "./schemas/recipes.schema";
import { Model } from "mongoose";

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipes.name) private recipeModel: Model<RecipesDocument>
  ) {}

  async findAll(): Promise<RecipeDto[]> {
    const recipes = await this.recipeModel.find();

    return recipes.map((recipe) => ({
      ...recipe.toObject(),
      id: recipe._id.toString(),
      author: recipe.author.toString(),
      category: recipe.category.toString(),
    }));
  }

  async create(createRecipe: CreateRecipeDto): Promise<RecipeDto> {
    const currentDate = new Date().toISOString();

    const recipe = await this.recipeModel.create({
      ...createRecipe,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    return {
      ...recipe.toObject(),
      id: recipe._id.toString(),
      author: recipe.author.toString(),
      category: recipe.category.toString(),
    };
  }
}
