import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { FavoriteDto } from "./dto/favorite.dto";
import { GetCurrentUserId } from "src/common/decorators";
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { PaginatedResponseDto } from "src/dto/paginated-response.dto";
import { PaginationQueryDto } from "src/dto/pagination-query.dto";

@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiBearerAuth()
  @Post("/:recipeId")
  @ApiOkResponse({ type: FavoriteDto })
  async create(
    @Param("recipeId") recipeId: string,
    @GetCurrentUserId() userId: string
  ): Promise<FavoriteDto> {
    return await this.favoritesService.create(recipeId, userId);
  }

  @ApiBearerAuth()
  @Get("/:recipeId")
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  @ApiOkResponse({ type: FavoriteDto, isArray: true })
  async findAll(
    @Param("recipeId") recipeId: string,
    @GetCurrentUserId() userId: string,
    @Query() paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<FavoriteDto>> {
    return await this.favoritesService.findAll(
      recipeId,
      userId,
      paginationQuery
    );
  }

  @ApiBearerAuth()
  @Delete("/:recipeId")
  @ApiOkResponse({ type: String })
  async remove(
    @Param("recipeId") recipeId: string,
    @GetCurrentUserId() userId: string
  ): Promise<string> {
    return await this.favoritesService.remove(recipeId, userId);
  }
}
