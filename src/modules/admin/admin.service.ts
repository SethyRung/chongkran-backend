import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "@/db/schema/user.schema";
import { Recipe, RecipeDocument } from "@/db/schema/recipe.schema";
import { AdminStatsResponseDto } from "./dto/admin-stats-response.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async getStats(): Promise<AdminStatsResponseDto> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalRecipes,
      totalPendingRecipes,
      totalPendingAuthorRequests,
      totalReviews,
      recentPendingRecipes,
      recentPendingAuthorRequests,
      usersByRole,
      userTrendSeries,
      recipeTrendSeries,
      popularRecipes,
      recentUsers,
      recentRecipes,
      recentReviews,
    ] = await Promise.all([
      this.userModel.countDocuments({ isDeleted: { $ne: true } }).exec(),

      this.recipeModel.countDocuments().exec(),

      this.recipeModel.countDocuments({ status: "pending" }).exec(),

      this.userModel
        .countDocuments({ authorRequestStatus: "pending", isDeleted: { $ne: true } })
        .exec(),

      this.recipeModel
        .aggregate<{ total: number }>([{ $unwind: "$reviews" }, { $count: "total" }])
        .exec(),

      this.recipeModel
        .find({ status: "pending" })
        .select("title authorName image createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .exec(),

      this.userModel
        .find({ authorRequestStatus: "pending", isDeleted: { $ne: true } })
        .select("firstName lastName email avatar")
        .sort({ _id: -1 })
        .limit(5)
        .lean()
        .exec(),

      this.userModel
        .aggregate<{ _id: string; count: number }>([
          { $match: { isDeleted: { $ne: true } } },
          { $group: { _id: "$role", count: { $sum: 1 } } },
        ])
        .exec(),

      this.userModel
        .aggregate<{ _id: string; count: number }>([
          {
            $match: { isDeleted: { $ne: true }, _id: { $gte: this.dateToObjectId(thirtyDaysAgo) } },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$_id" } },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .exec(),

      this.recipeModel
        .aggregate<{ _id: string; count: number }>([
          { $match: { createdAt: { $gte: thirtyDaysAgo } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .exec(),

      this.recipeModel
        .find()
        .select("title image views likes")
        .sort({ views: -1 })
        .limit(5)
        .lean()
        .exec(),

      this.userModel
        .find({ isDeleted: { $ne: true } })
        .select("firstName lastName")
        .sort({ _id: -1 })
        .limit(3)
        .lean()
        .exec(),

      this.recipeModel
        .find()
        .select("title authorName")
        .sort({ createdAt: -1 })
        .limit(3)
        .lean()
        .exec(),

      this.recipeModel
        .aggregate<{
          title: string;
          review: { userName: string; comment: string; createdAt: Date };
        }>([
          { $unwind: "$reviews" },
          { $sort: { "reviews.createdAt": -1 } },
          { $limit: 3 },
          { $project: { title: 1, review: "$reviews" } },
        ])
        .exec(),
    ]);

    const recentActivity = [
      ...recentUsers.map((u) => ({
        type: "user" as const,
        description: `${u.firstName} ${u.lastName} joined`,
        timestamp: u._id.getTimestamp(),
      })),
      ...recentRecipes.map((r) => ({
        type: "recipe" as const,
        description: `${r.authorName} published "${r.title}"`,
        timestamp: r.createdAt,
      })),
      ...recentReviews.map((r) => ({
        type: "review" as const,
        description: `${r.review.userName} reviewed "${r.title}"`,
        timestamp: r.review.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    return {
      totalUsers,
      totalRecipes,
      totalPendingRecipes,
      totalPendingAuthorRequests,
      totalReviews: totalReviews[0]?.total ?? 0,
      recentPendingRecipes: recentPendingRecipes.map((r) => ({
        id: r._id.toString(),
        title: r.title,
        authorName: r.authorName,
        image: r.image ?? "",
        createdAt: r.createdAt,
      })),
      recentPendingAuthorRequests: recentPendingAuthorRequests.map((u) => ({
        id: u._id.toString(),
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        avatar: u.avatar ?? "",
      })),
      usersByRole: usersByRole.map((r) => ({ role: r._id, count: r.count })),
      userTrendSeries: userTrendSeries.map((p) => ({ date: p._id, count: p.count })),
      recipeTrendSeries: recipeTrendSeries.map((p) => ({ date: p._id, count: p.count })),
      popularRecipes: popularRecipes.map((r) => ({
        id: r._id.toString(),
        title: r.title,
        image: r.image,
        views: r.views,
        likes: r.likes.length,
      })),
      recentActivity,
    };
  }

  private dateToObjectId(date: Date) {
    return new Types.ObjectId(Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000");
  }
}
