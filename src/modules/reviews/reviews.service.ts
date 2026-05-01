import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReviewDto } from "./dto/review.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Recipe, RecipeDocument } from "@/db/schema/recipe.schema";
import { User, UserDocument } from "@/db/schema/user.schema";
import { Model, Types } from "mongoose";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";
import { PaginatedResponseDto } from "@/dto/paginated-response.dto";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    recipeId: string,
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewDto> {
    const recipe = await this.recipeModel.findById(recipeId).exec();
    if (!recipe) throw new NotFoundException("Recipe not found.");

    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException("User not found.");

    const currentDate = new Date();
    const review = {
      userId: new Types.ObjectId(userId),
      userName: `${user.firstName} ${user.lastName}`,
      userAvatar: user.avatar,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    await this.recipeModel.findByIdAndUpdate(recipeId, { $push: { reviews: review } });

    return {
      userId,
      userName: review.userName,
      userAvatar: review.userAvatar,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async findAll(
    recipeId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ReviewDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const recipe = await this.recipeModel.findById(recipeId).select("reviews").exec();
    if (!recipe) throw new NotFoundException("Recipe not found.");

    const reviews = recipe.reviews || [];
    const total = reviews.length;
    const paginated = reviews.slice(offset, offset + limit);

    const data: ReviewDto[] = paginated.map((review) => ({
      userId: review.userId.toString(),
      userName: review.userName,
      userAvatar: review.userAvatar,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<ReviewDto> {
    const recipe = await this.recipeModel.findOne({ "reviews._id": new Types.ObjectId(id) }).exec();
    if (!recipe) throw new NotFoundException("Review not found.");

    const review = recipe.reviews.find((r) => r._id?.toString() === id);
    if (!review) throw new NotFoundException("Review not found.");

    if (review.userId.toString() !== userId) throw new ForbiddenException("Not authorized");

    Object.assign(review, { ...updateReviewDto, updatedAt: new Date() });
    await recipe.save();

    return {
      userId: review.userId.toString(),
      userName: review.userName,
      userAvatar: review.userAvatar,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async remove(id: string, userId: string): Promise<string> {
    const recipe = await this.recipeModel.findOne({ "reviews._id": new Types.ObjectId(id) }).exec();
    if (!recipe) throw new NotFoundException("Review not found.");

    const review = recipe.reviews.find((r) => r._id?.toString() === id);
    if (!review) throw new NotFoundException("Review not found.");

    if (review.userId.toString() !== userId) throw new ForbiddenException("Not authorized");

    recipe.reviews = recipe.reviews.filter((r) => r._id?.toString() !== id);
    await recipe.save();

    return "Review deleted successfully";
  }
}
