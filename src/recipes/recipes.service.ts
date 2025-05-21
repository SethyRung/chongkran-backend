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
import { Recipe, RecipeDocument } from "./schemas/recipe.schema";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "src/user/schemas/user.schema";
import { UpdateRecipeDto } from "./dto/update_recipe.dto";
import { PaginationQueryDto } from "src/dto/pagination-query.dto";
import { PaginatedResponseDto } from "src/dto/paginated-response.dto";

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<RecipeDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [recipes, total] = await Promise.all([
      this.recipeModel.find().skip(skip).limit(limit).exec(),
      this.recipeModel.countDocuments().exec(),
    ]);

    const data: RecipeDto[] = recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      author: recipe.author.toString(),
      tags: recipe.tags,
      image: recipe.image,
      cookTime: recipe.cookTime,
      likes: recipe.likes.length,
      views: recipe.views,
      difficulty: recipe.difficulty,
      status: recipe.status,
      category: recipe.category.toString(),
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    }));

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findMy(
    userId: string,
    status: RecipeDto["status"] & "all",
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<RecipeDto>> {
    const filter = status && status !== "all" ? { status } : {};

    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [recipes, total] = await Promise.all([
      this.recipeModel
        .find({ author: userId, ...filter })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.recipeModel.countDocuments({ author: userId, ...filter }).exec(),
    ]);

    const data: RecipeDto[] = recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      author: recipe.author.toString(),
      tags: recipe.tags,
      image: recipe.image,
      cookTime: recipe.cookTime,
      likes: recipe.likes.length,
      views: recipe.views,
      difficulty: recipe.difficulty,
      status: recipe.status,
      category: recipe.category.toString(),
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    }));

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<RecipeDto> {
    const recipe = await this.recipeModel.findById(id).exec();

    if (!recipe)
      throw new HttpException("Recipe not found.", HttpStatus.BAD_REQUEST);

    return {
      ...recipe.toObject(),
      id: recipe._id.toString(),
      author: recipe.author.toString(),
      likes: recipe.likes.length,
      category: recipe.category.toString(),
    };
  }

  async findPending(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<RecipeDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [recipes, total] = await Promise.all([
      this.recipeModel
        .find({ status: "pending" })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.recipeModel.countDocuments({ status: "pending" }).exec(),
    ]);

    const data: RecipeDto[] = recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      author: recipe.author.toString(),
      tags: recipe.tags,
      image: recipe.image,
      cookTime: recipe.cookTime,
      likes: recipe.likes.length,
      views: recipe.views,
      difficulty: recipe.difficulty,
      status: recipe.status,
      category: recipe.category.toString(),
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    }));

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async create(
    userId: string,
    createRecipe: CreateRecipeDto
  ): Promise<RecipeDto> {
    const user = await this.userModel.findById(userId).exec();
    if (!user)
      throw new HttpException("User not found.", HttpStatus.BAD_REQUEST);
    else if (user.role === "user")
      throw new HttpException(
        "You are not authorized to create a recipe.",
        HttpStatus.FORBIDDEN
      );

    const currentDate = new Date().toISOString();

    const created = await this.recipeModel.create({
      ...createRecipe,
      author: user.id,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    return {
      ...created.toObject(),
      id: created._id.toString(),
      author: created.author.toString(),
      likes: created.likes.length,
      category: created.category.toString(),
    };
  }

  async updateStatus(
    id: string,
    status: RecipeDto["status"]
  ): Promise<RecipeDto> {
    const currentDate = new Date().toISOString();

    const updated = await this.recipeModel
      .findByIdAndUpdate(
        id,
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
      likes: updated.likes.length,
      category: updated.category.toString(),
    };
  }

  async update(
    id: string,
    userId: string,
    updateRecipe: UpdateRecipeDto
  ): Promise<RecipeDto> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) throw new NotFoundException("Recipe not found");

    const user = await this.userModel.findById(userId).exec();
    if (recipe.author.toString() !== userId && user?.role !== "admin")
      throw new ForbiddenException("Not authorized");

    const currentDate = new Date().toISOString();
    Object.assign(recipe, { ...updateRecipe, updateAt: currentDate });
    const updated = await recipe.save();
    return {
      ...updated.toObject(),
      id: updated._id.toString(),
      author: updated.author.toString(),
      likes: updated.likes.length,
      category: updated.category.toString(),
    };
  }

  async delete(id: string, userId: string): Promise<string> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) throw new NotFoundException("Recipe not found.");

    const user = await this.userModel.findById(userId).exec();
    if (recipe.author.toString() !== userId && user?.role !== "admin")
      throw new ForbiddenException("Not authorized");

    await recipe.deleteOne();
    return "Recipe deleted successfully";
  }

  async likeRecipe(id: string, userId: string) {
    const recipe = await this.recipeModel.findById(id);
    if (!recipe) throw new NotFoundException("Recipe not found.");

    const userObjectId = new Types.ObjectId(userId);

    if (recipe.likes.some((id) => id.equals(userObjectId))) {
      // Unlike
      recipe.likes = recipe.likes.filter((id) => !id.equals(userObjectId));
    } else {
      // Like
      recipe.likes.push(userObjectId);
    }

    await recipe.save();
  }

  async incrementViews(id: string) {
    await this.recipeModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }
}
