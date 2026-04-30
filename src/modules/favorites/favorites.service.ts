import { Injectable, NotFoundException } from "@nestjs/common";
import { FavoriteDto } from "./dto/favorite.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Favorite, FavoriteDocument } from "@/db/schema/favorite.schema";
import { Model } from "mongoose";
import { PaginatedResponseDto } from "@/dto/paginated-response.dto";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";

@Injectable()
export class FavoritesService {
  constructor(@InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>) {}

  async create(recipeId: string, userId: string): Promise<FavoriteDto> {
    const existingFavorite = await this.favoriteModel.findOne({ recipeId, userId }).exec();

    if (existingFavorite) {
      return {
        ...existingFavorite.toJSON(),
        recipeId,
        userId,
      } as unknown as FavoriteDto;
    }

    const createdAt = new Date().toISOString();
    const newFavorite = await this.favoriteModel.create({
      recipeId,
      userId,
      createdAt,
    });

    return {
      ...newFavorite.toJSON(),
      recipeId,
      userId,
    } as unknown as FavoriteDto;
  }

  async findAll(
    recipeId: string,
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<FavoriteDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const [favorites, total] = await Promise.all([
      this.favoriteModel.find({ recipeId, userId }).skip(offset).limit(limit).exec(),
      this.favoriteModel.countDocuments({ recipeId, userId }).exec(),
    ]);

    const data = favorites.map((favorite) => ({
      ...favorite.toJSON(),
      recipeId: favorite.recipeId.toString(),
      userId: favorite.userId.toString(),
    })) as unknown as FavoriteDto[];

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async remove(recipeId: string, userId: string): Promise<string> {
    const favorite = await this.favoriteModel.findOne({ recipeId, userId }).exec();
    if (!favorite) throw new NotFoundException("Favorite not found");

    await favorite.deleteOne();
    return "Favorite deleted successfully";
  }
}
