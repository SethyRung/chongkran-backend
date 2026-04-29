import { Controller, Get, Post, Param, Delete, Query } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { FavoriteDto } from "./dto/favorite.dto";
import {
  ApiOkResponsePaginated,
  ApiOkResponseWrapper,
  GetCurrentUserId,
} from "@/common/decorators";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";

@Controller("/api/favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiBearerAuth()
  @Post("/:recipeId")
  @ApiOkResponseWrapper({ type: FavoriteDto })
  async create(@Param("recipeId") recipeId: string, @GetCurrentUserId() userId: string) {
    return this.favoritesService.create(recipeId, userId);
  }

  @ApiBearerAuth()
  @Get("/:recipeId")

  @ApiOkResponsePaginated({ type: FavoriteDto })
  async findAll(
    @Param("recipeId") recipeId: string,
    @GetCurrentUserId() userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.favoritesService.findAll(recipeId, userId, paginationQuery);
  }

  @ApiBearerAuth()
  @Delete("/:recipeId")
  @ApiOkResponseWrapper({ type: String })
  async remove(@Param("recipeId") recipeId: string, @GetCurrentUserId() userId: string) {
    return this.favoritesService.remove(recipeId, userId);
  }
}
