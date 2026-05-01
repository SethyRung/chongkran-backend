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
import { Recipe, RecipeDocument } from "@/db/schema/recipe.schema";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "@/db/schema/user.schema";
import { UpdateRecipeDto } from "./dto/update_recipe.dto";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";
import { PaginatedResponseDto } from "@/dto/paginated-response.dto";

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<RecipeDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const [recipes, total] = await Promise.all([
      this.recipeModel.find().skip(offset).limit(limit).exec(),
      this.recipeModel.countDocuments().exec(),
    ]);

    const data: RecipeDto[] = recipes.map((recipe) => ({
      ...recipe.toJSON(),
      author: recipe.author.toString(),
      likes: recipe.likes.length,
      category: recipe.category.toString(),
    }));

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async findMy(
    userId: string,
    status: RecipeDto["status"] & "all",
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<RecipeDto>> {
    const filter = status && status !== "all" ? { status } : {};

    const { offset = 0, limit = 10 } = paginationQuery;

    const [recipes, total] = await Promise.all([
      this.recipeModel
        .find({ author: new Types.ObjectId(userId), ...filter })
        .skip(offset)
        .limit(limit)
        .exec(),
      this.recipeModel.countDocuments({ author: new Types.ObjectId(userId), ...filter }).exec(),
    ]);

    const data: RecipeDto[] = recipes.map((recipe) => ({
      ...recipe.toJSON(),
      author: recipe.author.toString(),
      likes: recipe.likes.length,
      category: recipe.category.toString(),
    }));

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async findById(id: string): Promise<RecipeDto> {
    const recipe = await this.recipeModel.findById(id).exec();

    if (!recipe) throw new HttpException("Recipe not found.", HttpStatus.BAD_REQUEST);

    return {
      ...recipe.toJSON(),
      author: recipe.author.toString(),
      likes: recipe.likes.length,
      category: recipe.category.toString(),
    };
  }

  async findPending(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<RecipeDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const [recipes, total] = await Promise.all([
      this.recipeModel.find({ status: "pending" }).skip(offset).limit(limit).exec(),
      this.recipeModel.countDocuments({ status: "pending" }).exec(),
    ]);

    const data: RecipeDto[] = recipes.map((recipe) => ({
      ...recipe.toJSON(),
      author: recipe.author.toString(),
      likes: recipe.likes.length,
      category: recipe.category.toString(),
    }));

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async create(
    userId: string,
    userRole: string,
    createRecipe: CreateRecipeDto,
  ): Promise<RecipeDto> {
    if (userRole === "user") {
      throw new HttpException("You are not authorized to create a recipe.", HttpStatus.FORBIDDEN);
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new HttpException("User not found.", HttpStatus.BAD_REQUEST);

    const currentDate = new Date().toISOString();

    const created = await this.recipeModel.create({
      ...createRecipe,
      author: user._id,
      authorName: `${user.firstName} ${user.lastName}`,
      authorAvatar: user.avatar,
      authorBio: user.bio,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    return {
      ...created.toJSON(),
      author: created.author.toString(),
      likes: created.likes.length,
      category: created.category.toString(),
    };
  }

  async updateStatus(id: string, status: RecipeDto["status"]): Promise<RecipeDto> {
    const currentDate = new Date().toISOString();

    const updated = await this.recipeModel
      .findByIdAndUpdate(id, { $set: { status: status, updateAt: currentDate } }, { new: true })
      .exec();

    if (!updated)
      throw new HttpException(
        "Recipe not found. Please check the information and try again.",
        HttpStatus.BAD_REQUEST,
      );

    return {
      ...updated.toJSON(),
      author: updated.author.toString(),
      likes: updated.likes.length,
      category: updated.category.toString(),
    };
  }

  async update(
    id: string,
    userId: string,
    userRole: string,
    updateRecipe: UpdateRecipeDto,
  ): Promise<RecipeDto> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) throw new NotFoundException("Recipe not found");

    if (recipe.author.toString() !== userId && userRole !== "admin")
      throw new ForbiddenException("Not authorized");

    const currentDate = new Date().toISOString();
    Object.assign(recipe, { ...updateRecipe, updateAt: currentDate });
    const updated = await recipe.save();
    return {
      ...updated.toJSON(),
      author: updated.author.toString(),
      likes: updated.likes.length,
      category: updated.category.toString(),
    };
  }

  async delete(id: string, userId: string, userRole: string): Promise<string> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) throw new NotFoundException("Recipe not found.");

    if (recipe.author.toString() !== userId && userRole !== "admin")
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

  async findByAuthor(
    authorId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<RecipeDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const [recipes, total] = await Promise.all([
      this.recipeModel
        .find({ author: new Types.ObjectId(authorId), status: "approved" })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .exec(),
      this.recipeModel
        .countDocuments({ author: new Types.ObjectId(authorId), status: "approved" })
        .exec(),
    ]);

    const data: RecipeDto[] = recipes.map((recipe) => ({
      ...recipe.toJSON(),
      author: recipe.author.toString(),
      likes: recipe.likes.length,
      category: recipe.category.toString(),
    }));

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async findByIdWithAuthor(id: string): Promise<RecipeDto> {
    const recipe = await this.recipeModel.findById(id).exec();

    if (!recipe) {
      throw new HttpException("Recipe not found.", HttpStatus.BAD_REQUEST);
    }

    return {
      ...recipe.toJSON(),
      author: recipe.author.toString(),
      likes: recipe.likes.length,
      category: recipe.category.toString(),
    };
  }

  async findAllWithAuthors(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<RecipeDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const [recipes, total] = await Promise.all([
      this.recipeModel
        .find({ status: "approved" })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .exec(),
      this.recipeModel.countDocuments({ status: "approved" }).exec(),
    ]);

    const data: RecipeDto[] = recipes.map((recipe) => ({
      ...recipe.toJSON(),
      author: recipe.author.toString(),
      likes: recipe.likes.length,
      category: recipe.category.toString(),
    }));

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async getPopularRecipesByAuthor(authorId: string, limit = 5): Promise<RecipeDto[]> {
    const recipes = await this.recipeModel
      .find({ author: new Types.ObjectId(authorId), status: "approved" })
      .sort({ views: -1, likes: -1 })
      .limit(limit)
      .exec();

    return recipes.map((recipe) => ({
      ...recipe.toJSON(),
      author: recipe.author.toString(),
      likes: recipe.likes.length,
      category: recipe.category.toString(),
    }));
  }

  async getRecentRecipesByAuthor(authorId: string, limit = 5): Promise<RecipeDto[]> {
    const recipes = await this.recipeModel
      .find({ author: new Types.ObjectId(authorId), status: "approved" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return recipes.map((recipe) => ({
      ...recipe.toJSON(),
      author: recipe.author.toString(),
      likes: recipe.likes.length,
      category: recipe.category.toString(),
    }));
  }
}
