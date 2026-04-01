import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReviewDto } from "./dto/review.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Review, ReviewDocument } from "./schemas/review.schema";
import { Model } from "mongoose";
import { User, UserDocument } from "@/user/schemas/user.schema";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";
import { PaginatedResponseDto } from "@/dto/paginated-response.dto";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    recipeId: string,
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewDto> {
    const currentDate = new Date().toISOString();

    const created = await this.reviewModel.create({
      ...createReviewDto,
      recipeId,
      userId,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    return {
      id: created._id.toString(),
      recipeId,
      userId,
      rating: created.rating,
      comment: created.comment,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async findAll(
    recipeId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ReviewDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.reviewModel.find().skip(skip).limit(limit).exec(),
      this.reviewModel.countDocuments().exec(),
    ]);

    const data: ReviewDto[] = reviews.map((review) => ({
      id: review._id.toString(),
      recipeId,
      userId: review.userId.toString(),
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    return {
      content: data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<ReviewDto> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) throw new NotFoundException("Review not found.");
    return {
      id: review._id.toString(),
      recipeId: review.recipeId.toString(),
      userId: review.userId.toString(),
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<ReviewDto> {
    const review = await this.reviewModel.findOne({ _id: id, userId }).exec();
    if (!review) throw new NotFoundException("Review not found");

    const currentDate = new Date().toISOString();
    Object.assign(review, { ...updateReviewDto, updateAt: currentDate });
    const updated = await review.save();
    return {
      id: updated._id.toString(),
      recipeId: updated.recipeId.toString(),
      userId,
      rating: updated.rating,
      comment: updated.comment,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async remove(id: string, userId: string): Promise<string> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) throw new NotFoundException("Review not found.");

    const user = await this.userModel.findById(userId).exec();
    if (review.userId.toString() !== userId && user?.role !== "admin")
      throw new ForbiddenException("Not authorized");

    await review.deleteOne();
    return "Review deleted successfully";
  }
}
