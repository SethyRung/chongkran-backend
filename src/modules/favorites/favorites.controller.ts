import { Controller, Get, Post, Param, Delete } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ApiOkResponseWrapper, GetCurrentUserId } from "@/common/decorators";

@Controller("/api/favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiBearerAuth()
  @Post("/:recipeId")
  @ApiOkResponseWrapper({ type: String })
  async addFavorite(@Param("recipeId") recipeId: string, @GetCurrentUserId() userId: string) {
    return this.favoritesService.addFavorite(recipeId, userId);
  }

  @ApiBearerAuth()
  @Delete("/:recipeId")
  @ApiOkResponseWrapper({ type: String })
  async removeFavorite(@Param("recipeId") recipeId: string, @GetCurrentUserId() userId: string) {
    return this.favoritesService.removeFavorite(recipeId, userId);
  }

  @ApiBearerAuth()
  @Get()
  @ApiOkResponseWrapper({ type: String, isArray: true })
  async getFavoriteRecipes(@GetCurrentUserId() userId: string) {
    return this.favoritesService.getFavoriteRecipes(userId);
  }

  @ApiBearerAuth()
  @Get("/:recipeId/check")
  @ApiOkResponseWrapper({ type: Boolean })
  async isFavorite(@Param("recipeId") recipeId: string, @GetCurrentUserId() userId: string) {
    return this.favoritesService.isFavorite(recipeId, userId);
  }
}
