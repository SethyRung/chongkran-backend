import { Controller, Get, Post, Param, Delete, Query } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { FavoriteDto } from "./dto/favorite.dto";
import { ApiPaginatedResponse, ApiResponse, GetCurrentUserId } from "@/common/decorators";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";
import { buildResponse } from "@/common/utils/response.util";

@Controller("/api/favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiBearerAuth()
  @Post("/:recipeId")
  @ApiResponse({ type: FavoriteDto })
  async create(@Param("recipeId") recipeId: string, @GetCurrentUserId() userId: string) {
    return buildResponse({
      data: await this.favoritesService.create(recipeId, userId),
    });
  }

  @ApiBearerAuth()
  @Get("/:recipeId")
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  @ApiPaginatedResponse({ type: FavoriteDto })
  async findAll(
    @Param("recipeId") recipeId: string,
    @GetCurrentUserId() userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return buildResponse({
      data: await this.favoritesService.findAll(recipeId, userId, paginationQuery),
    });
  }

  @ApiBearerAuth()
  @Delete("/:recipeId")
  @ApiResponse({ type: String })
  async remove(@Param("recipeId") recipeId: string, @GetCurrentUserId() userId: string) {
    return buildResponse({
      data: await this.favoritesService.remove(recipeId, userId),
    });
  }
}
