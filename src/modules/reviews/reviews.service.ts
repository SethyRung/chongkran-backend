import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReviewDto } from "./dto/review.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Review, ReviewDocument } from "@/db/schema/review.schema";
import { Model } from "mongoose";
import { User, UserDocument } from "@/db/schema/user.schema";
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
      ...created.toJSON(),
      recipeId,
      userId,
    };
  }

  async findAll(
    recipeId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ReviewDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const [reviews, total] = await Promise.all([
      this.reviewModel.find().skip(offset).limit(limit).exec(),
      this.reviewModel.countDocuments().exec(),
    ]);

    const data: ReviewDto[] = reviews.map((review) => ({
      ...review.toJSON(),
      recipeId,
      userId: review.userId.toString(),
    }));

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async findOne(id: string): Promise<ReviewDto> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) throw new NotFoundException("Review not found.");
    return {
      ...review.toJSON(),
      recipeId: review.recipeId.toString(),
      userId: review.userId.toString(),
    };
  }

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<ReviewDto> {
    const review = await this.reviewModel.findOne({ _id: id, userId }).exec();
    if (!review) throw new NotFoundException("Review not found");

    const currentDate = new Date().toISOString();
    Object.assign(review, { ...updateReviewDto, updateAt: currentDate });
    const updated = await review.save();
    return {
      ...updated.toJSON(),
      recipeId: updated.recipeId.toString(),
      userId,
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
