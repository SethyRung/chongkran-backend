import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "@/db/schema/user.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class FavoritesService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async addFavorite(recipeId: string, userId: string): Promise<string> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException("User not found");

    const recipeObjectId = new Types.ObjectId(recipeId);
    if (user.favoriteRecipes.some((id) => id.equals(recipeObjectId))) {
      return "Recipe is already in favorites";
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { favoriteRecipes: recipeObjectId },
    });
    return "Recipe added to favorites";
  }

  async removeFavorite(recipeId: string, userId: string): Promise<string> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException("User not found");

    const recipeObjectId = new Types.ObjectId(recipeId);
    await this.userModel.findByIdAndUpdate(userId, { $pull: { favoriteRecipes: recipeObjectId } });
    return "Recipe removed from favorites";
  }

  async getFavoriteRecipes(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).select("favoriteRecipes").exec();
    if (!user) throw new NotFoundException("User not found");
    return user.favoriteRecipes.map((id) => id.toString());
  }

  async isFavorite(recipeId: string, userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).select("favoriteRecipes").exec();
    if (!user) return false;
    return user.favoriteRecipes.some((id) => id.equals(new Types.ObjectId(recipeId)));
  }
}
