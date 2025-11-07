import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { UserResponseDto } from "./dto/user_response.dto";
import { plainToInstance } from "class-transformer";
import {
  AuthorRequesDocument,
  AuthorRequest,
} from "./schemas/author_request.schema";
import { UpdateUserDto } from "./dto/update_user.dto";
import { PaginationQueryDto } from "src/dto/pagination-query.dto";
import { PaginatedResponseDto } from "src/dto/paginated-response.dto";
import { Recipe, RecipeDocument } from "../recipes/schemas/recipe.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AuthorRequest.name)
    private authorRequestModel: Model<AuthorRequesDocument>,
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>
  ) {}
  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

      const users = await this.userModel
      .find({
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.userModel
      .countDocuments({
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      })
      .exec();

    const data: UserResponseDto[] = plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });

    return {
      content: data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async updateById(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user)
      throw new HttpException(
        "User not found. Please check the information and try again.",
        HttpStatus.BAD_REQUEST
      );
    await this.userModel.updateOne({ _id: id }, { $set: updateUserDto }).exec();
    return "User information updated successfully.";
  }

  async deleteById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user)
      throw new HttpException(
        "User not found. Please check the information and try again.",
        HttpStatus.BAD_REQUEST
      );
    await this.userModel
      .updateOne({ _id: id }, { $set: { isDeleted: true } })
      .exec();
    return "User deleted successfully.";
  }

  async becomeAuthor(id: string): Promise<string> {
    if ((await this.authorRequestModel.exists({ userId: id })) === null) {
      await this.authorRequestModel.create({
        userId: id,
        status: "pending",
      });
    }

    return "Waiting for approval";
  }

  async getAuthors(
    paginationQuery: PaginationQueryDto,
    search?: string,
    expertise?: string
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {
      role: "author",
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
      ];
    }

    if (expertise) {
      query.expertise = { $in: [expertise] };
    }

    const authors = await this.userModel
      .find(query)
      .select("-password -refreshToken")
      .sort({ followersCount: -1, recipesCount: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.userModel.countDocuments(query).exec();

    const data: UserResponseDto[] = plainToInstance(UserResponseDto, authors, {
      excludeExtraneousValues: true,
    });

    return {
      content: data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getAuthorById(id: string): Promise<UserResponseDto> {
    const author = await this.userModel
      .findOne({ _id: id, role: "author" })
      .select("-password -refreshToken")
      .exec();

    if (!author) {
      throw new HttpException("Author not found", HttpStatus.NOT_FOUND);
    }

    return plainToInstance(UserResponseDto, author, {
      excludeExtraneousValues: true,
    });
  }

  async getAuthorStats(authorId: string): Promise<any> {
    const author = await this.userModel.findById(authorId).exec();
    if (!author || author.role !== "author") {
      throw new HttpException("Author not found", HttpStatus.NOT_FOUND);
    }

    // Get recipe statistics
    const recipeStats = await this.recipeModel.aggregate([
      { $match: { author: new Types.ObjectId(authorId) } },
      {
        $group: {
          _id: null,
          totalRecipes: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: { $size: "$likes" } },
          averageDifficulty: {
            $avg: {
              $cond: [
                { $eq: ["$difficulty", "easy"] },
                1,
                { $cond: [{ $eq: ["$difficulty", "medium"] }, 2, 3] },
              ],
            },
          },
        },
      },
    ]);

    const stats = recipeStats[0] || {
      totalRecipes: 0,
      totalViews: 0,
      totalLikes: 0,
      averageDifficulty: 0,
    };

    return {
      authorId,
      followersCount: author.followersCount || 0,
      followingCount: author.followingCount || 0,
      recipesCount: stats.totalRecipes,
      totalViews: stats.totalViews,
      totalLikes: stats.totalLikes,
      averageDifficulty: Math.round(stats.averageDifficulty * 10) / 10,
    };
  }

  async updateAuthorProfile(
    authorId: string,
    updateData: Partial<User>
  ): Promise<UserResponseDto> {
    const author = await this.userModel.findOne({
      _id: authorId,
      role: "author",
    });

    if (!author) {
      throw new HttpException("Author not found", HttpStatus.NOT_FOUND);
    }

    // Only allow updating author-specific fields
    const allowedFields = [
      "bio",
      "expertise",
      "avatar",
      "website",
      "instagram",
      "youtube",
      "tiktok",
    ];

    const filteredData: any = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const updatedAuthor = await this.userModel
      .findByIdAndUpdate(authorId, { $set: filteredData }, { new: true })
      .select("-password -refreshToken")
      .exec();

    return plainToInstance(UserResponseDto, updatedAuthor, {
      excludeExtraneousValues: true,
    });
  }

  async getPopularAuthors(limit = 10): Promise<UserResponseDto[]> {
    const authors = await this.userModel
      .find({
        role: "author",
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      })
      .select("-password -refreshToken")
      .sort({ followersCount: -1, recipesCount: -1 })
      .limit(limit)
      .exec();

    return plainToInstance(UserResponseDto, authors, {
      excludeExtraneousValues: true,
    });
  }

  async searchAuthors(query: string, limit = 20): Promise<UserResponseDto[]> {
    const searchRegex = new RegExp(query, "i");

    const authors = await this.userModel
      .find({
        role: "author",
        $and: [
          {
            $or: [
              { firstName: { $regex: searchRegex } },
              { lastName: { $regex: searchRegex } },
              { bio: { $regex: searchRegex } },
              { expertise: { $in: [searchRegex] } },
            ],
          },
          {
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
          },
        ],
      })
      .select("-password -refreshToken")
      .sort({ followersCount: -1 })
      .limit(limit)
      .exec();

    return plainToInstance(UserResponseDto, authors, {
      excludeExtraneousValues: true,
    });
  }

  async updateAuthorStatistics(authorId: string): Promise<void> {
    const recipeCount = await this.recipeModel.countDocuments({
      author: authorId,
    });

    const recipeStats = await this.recipeModel.aggregate([
      { $match: { author: new Types.ObjectId(authorId) } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: { $size: "$likes" } },
        },
      },
    ]);

    const stats = recipeStats[0] || { totalViews: 0, totalLikes: 0 };

    await this.userModel.findByIdAndUpdate(authorId, {
      $set: {
        recipesCount: recipeCount,
        totalViews: stats.totalViews,
        totalLikes: stats.totalLikes,
      },
    });
  }
}
