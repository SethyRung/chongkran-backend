import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewDto } from "./dto/review.dto";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import {
  ApiOkResponsePaginated,
  ApiOkResponseWrapper,
  GetCurrentUserId,
} from "@/common/decorators";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";

@Controller("/api/reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @Post("/:recipeId")
  @ApiOkResponseWrapper({ type: ReviewDto })
  async create(
    @Param("recipeId") recipeId: string,
    @GetCurrentUserId() userId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(recipeId, userId, createReviewDto);
  }

  @ApiBearerAuth()
  @Get("/recipe/:recipeId")
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  @ApiOkResponsePaginated({ type: ReviewDto })
  async findAll(@Param("recipeId") recipeId: string, @Query() paginationQuery: PaginationQueryDto) {
    return this.reviewsService.findAll(recipeId, paginationQuery);
  }

  @ApiBearerAuth()
  @Get(":id")
  @ApiOkResponseWrapper({ type: ReviewDto })
  async findOne(@Param("id") id: string) {
    return this.reviewsService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(":id")
  @ApiOkResponseWrapper({ type: ReviewDto })
  async update(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, userId, updateReviewDto);
  }

  @ApiBearerAuth()
  @Delete(":id")
  @ApiOkResponseWrapper({ type: String })
  async remove(@Param("id") id: string, @GetCurrentUserId() userId: string) {
    return this.reviewsService.remove(id, userId);
  }
}
