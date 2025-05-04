import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { FavoriteDto } from "./dto/favorite.dto";
import { GetCurrentUserId } from "src/common/decorators";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";

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
  @ApiOkResponse({ type: FavoriteDto, isArray: true })
  async findAll(
    @Param("recipeId") recipeId: string,
    @GetCurrentUserId() userId: string
  ): Promise<FavoriteDto[]> {
    return await this.favoritesService.findAll(recipeId, userId);
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
