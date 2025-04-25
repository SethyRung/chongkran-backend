import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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

  async findById(id: string): Promise<RecipeDto> {
    const recipe = await this.recipeModel.findById(id).exec();

    if (!recipe)
      throw new HttpException("Recipe not found.", HttpStatus.BAD_REQUEST);

    return {
      ...recipe.toObject(),
      id: recipe._id.toString(),
      author: recipe.author.toString(),
      category: recipe.category.toString(),
    };
  }

  async create(createRecipe: CreateRecipeDto): Promise<RecipeDto> {
    const currentDate = new Date().toISOString();

    const created = await this.recipeModel.create({
      ...createRecipe,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    return {
      ...created.toObject(),
      id: created._id.toString(),
      author: created.author.toString(),
      category: created.category.toString(),
    };
  }

  async updateStatus(
    recipeId: string,
    status: RecipeDto["status"]
  ): Promise<RecipeDto> {
    const currentDate = new Date().toISOString();

    const updated = await this.recipeModel
      .findByIdAndUpdate(
        recipeId,
        { $set: { status: status, updateAt: currentDate } },
        { new: true }
      )
      .exec();

    if (!updated)
      throw new HttpException(
        "Recipe not found. Please check the information and try again.",
        HttpStatus.BAD_REQUEST
      );

    return {
      ...updated.toObject(),
      id: updated._id.toString(),
      author: updated.author.toString(),
      category: updated.category.toString(),
    };
  }
}
