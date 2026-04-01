import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewDto } from "./dto/review.dto";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { ApiPaginatedResponse, ApiResponse, GetCurrentUserId } from "@/common/decorators";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";
import { buildResponse } from "@/common/utils/response.util";

@Controller("/api/reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @Post("/:recipeId")
  @ApiResponse({ type: ReviewDto })
  async create(
    @Param("recipeId") recipeId: string,
    @GetCurrentUserId() userId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return buildResponse({
      data: await this.reviewsService.create(recipeId, userId, createReviewDto),
    });
  }

  @ApiBearerAuth()
  @Get("/recipe/:recipeId")
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  @ApiPaginatedResponse({ type: ReviewDto })
  async findAll(@Param("recipeId") recipeId: string, @Query() paginationQuery: PaginationQueryDto) {
    return buildResponse({
      data: await this.reviewsService.findAll(recipeId, paginationQuery),
    });
  }

  @ApiBearerAuth()
  @Get(":id")
  @ApiResponse({ type: ReviewDto })
  async findOne(@Param("id") id: string) {
    return buildResponse({ data: await this.reviewsService.findOne(id) });
  }

  @ApiBearerAuth()
  @Patch(":id")
  @ApiResponse({ type: ReviewDto })
  async update(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return buildResponse({
      data: await this.reviewsService.update(id, userId, updateReviewDto),
    });
  }

  @ApiBearerAuth()
  @Delete(":id")
  @ApiResponse({ type: String })
  async remove(@Param("id") id: string, @GetCurrentUserId() userId: string) {
    return buildResponse({
      data: await this.reviewsService.remove(id, userId),
    });
  }
}
