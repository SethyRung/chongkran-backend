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
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/enums/role.enum";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";

@Controller("/api/reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @ApiQuery({ name: "search", type: String, required: false })
  @ApiQuery({ name: "ratingMin", type: Number, required: false })
  @ApiQuery({ name: "ratingMax", type: Number, required: false })
  @ApiOkResponsePaginated({ type: ReviewDto })
  async findAllGlobal(
    @Query() paginationQuery: PaginationQueryDto,
    @Query("search") search?: string,
    @Query("ratingMin") ratingMin?: number,
    @Query("ratingMax") ratingMax?: number,
  ) {
    return this.reviewsService.findAllGlobal(
      paginationQuery,
      search,
      ratingMin ? Number(ratingMin) : undefined,
      ratingMax ? Number(ratingMax) : undefined,
    );
  }

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
  @ApiOkResponsePaginated({ type: ReviewDto })
  async findAll(@Param("recipeId") recipeId: string, @Query() paginationQuery: PaginationQueryDto) {
    return this.reviewsService.findAll(recipeId, paginationQuery);
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
