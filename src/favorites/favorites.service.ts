import { Injectable, NotFoundException } from "@nestjs/common";
import { FavoriteDto } from "./dto/favorite.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Favorite, FavoriteDocument } from "./schemas/favorite.schema";
import { Model } from "mongoose";
import { PaginatedResponseDto } from "src/dto/paginated-response.dto";
import { PaginationQueryDto } from "src/dto/pagination-query.dto";

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

  async findAll(
    recipeId: string,
    userId: string,
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<FavoriteDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.favoriteModel
        .find({ recipeId, userId })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.favoriteModel.countDocuments({ recipeId, userId }).exec(),
    ]);

    const data: FavoriteDto[] = favorites.map((favorite) => ({
      id: favorite.id,
      recipeId: favorite.recipeId.toString(),
      userId: favorite.userId.toString(),
      createdAt: favorite.createdAt,
    }));

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
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
