import { Injectable, NotFoundException } from "@nestjs/common";
import { FavoriteDto } from "./dto/favorite.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Favorite, FavoriteDocument } from "./schemas/favorite.schema";
import { Model } from "mongoose";

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>
  ) {}

  async create(recipeId: string, userId: string): Promise<FavoriteDto> {
    const existingFavorite = await this.favoriteModel
      .findOne({ recipeId, userId })
      .exec();

    if (existingFavorite) {
      return {
        id: existingFavorite.id,
        recipeId,
        userId,
        createdAt: existingFavorite.createdAt,
      };
    }

    const createdAt = new Date().toISOString();
    const newFavorite = await this.favoriteModel.create({
      recipeId,
      userId,
      createdAt,
    });

    return {
      id: newFavorite.id,
      recipeId,
      userId,
      createdAt: newFavorite.createdAt,
    };
  }

  async findAll(recipeId: string, userId: string): Promise<FavoriteDto[]> {
    const favorites = await this.favoriteModel
      .find({ recipeId, userId })
      .exec();

    return favorites.map((favorite) => ({
      id: favorite.id,
      recipeId: favorite.recipeId.toString(),
      userId: favorite.userId.toString(),
      createdAt: favorite.createdAt,
    }));
  }

  async remove(recipeId: string, userId: string): Promise<string> {
    const favorite = await this.favoriteModel
      .findOne({ recipeId, userId })
      .exec();
    if (!favorite) throw new NotFoundException("Favorite not found");

    await favorite.deleteOne();
    return "Favorite deleted successfully";
  }
}
