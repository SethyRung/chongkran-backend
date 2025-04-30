import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { ReviewDto } from "./dto/review.dto";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { GetCurrentUserId } from "src/common/decorators";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @Post("/:recipeId")
  @ApiOkResponse({ type: ReviewDto })
  async create(
    @Param("recipeId") recipeId: string,
    @GetCurrentUserId() userId: string,
    @Body() createReviewDto: CreateReviewDto
  ): Promise<ReviewDto> {
    return await this.reviewsService.create(recipeId, userId, createReviewDto);
  }

  @ApiBearerAuth()
  @Get("/recipe/:recipeId")
  @ApiOkResponse({ type: ReviewDto, isArray: true })
  async findAll(@Param("recipeId") recipeId: string): Promise<ReviewDto[]> {
    return await this.reviewsService.findAll(recipeId);
  }

  @ApiBearerAuth()
  @Get(":id")
  @ApiOkResponse({ type: ReviewDto })
  async findOne(@Param("id") id: string): Promise<ReviewDto> {
    return await this.reviewsService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(":id")
  @ApiOkResponse({ type: ReviewDto })
  async update(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateReviewDto: UpdateReviewDto
  ): Promise<ReviewDto> {
    return await this.reviewsService.update(id, userId, updateReviewDto);
  }

  @ApiBearerAuth()
  @Delete(":id")
  @ApiOkResponse({ type: String })
  async remove(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string
  ): Promise<string> {
    return await this.reviewsService.remove(id, userId);
  }
}
