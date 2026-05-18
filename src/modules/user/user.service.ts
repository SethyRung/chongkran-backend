import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "@/db/schema/user.schema";
import { UserResponseDto } from "./dto/user_response.dto";
import { AuthorRequestResponseDto } from "./dto/author-request-response.dto";
import { plainToInstance } from "class-transformer";
import { UpdateUserDto } from "./dto/update_user.dto";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";
import { PaginatedResponseDto } from "@/dto/paginated-response.dto";
import { Recipe, RecipeDocument } from "@/db/schema/recipe.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}
  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const users = await this.userModel
      .find({
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      })
      .skip(offset)
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

    return new PaginatedResponseDto(data, { total, limit, offset });
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
        HttpStatus.BAD_REQUEST,
      );
    await this.userModel.updateOne({ _id: id }, { $set: updateUserDto }).exec();
    return "User information updated successfully.";
  }

  async deleteById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user)
      throw new HttpException(
        "User not found. Please check the information and try again.",
        HttpStatus.BAD_REQUEST,
      );
    await this.userModel.updateOne({ _id: id }, { $set: { isDeleted: true } }).exec();
    return "User deleted successfully.";
  }

  async becomeAuthor(id: string): Promise<string> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException("User not found.", HttpStatus.BAD_REQUEST);
    }

    if (user.authorRequestStatus) {
      return "Waiting for approval";
    }

    await this.userModel.updateOne({ _id: id }, { $set: { authorRequestStatus: "pending" } });
    return "Waiting for approval";
  }

  async getAuthorRequests(
    paginationQuery: PaginationQueryDto,
    status?: "pending" | "approved" | "rejected",
  ): Promise<PaginatedResponseDto<AuthorRequestResponseDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const query: any = { authorRequestStatus: { $exists: true } };
    if (status) query.authorRequestStatus = status;

    const users = await this.userModel
      .find(query)
      .skip(offset)
      .limit(limit)
      .sort({ _id: -1 })
      .exec();

    const total = await this.userModel.countDocuments(query).exec();

    const data: AuthorRequestResponseDto[] = users.map((user) => {
      const dto = new AuthorRequestResponseDto();
      dto.id = user.id;
      dto.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      };
      dto.status = user.authorRequestStatus!;
      return dto;
    });

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async approveAuthorRequest(userId: string): Promise<string> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new HttpException("User not found.", HttpStatus.BAD_REQUEST);
    }

    if (user.authorRequestStatus === "approved") {
      throw new HttpException("This request has already been approved.", HttpStatus.BAD_REQUEST);
    }

    await this.userModel.updateOne(
      { _id: userId },
      { $set: { authorRequestStatus: "approved", role: "author" } },
    );

    return "Author request approved successfully.";
  }

  async rejectAuthorRequest(userId: string): Promise<string> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new HttpException("User not found.", HttpStatus.BAD_REQUEST);
    }

    if (user.authorRequestStatus === "rejected") {
      throw new HttpException("This request has already been rejected.", HttpStatus.BAD_REQUEST);
    }

    await this.userModel.updateOne({ _id: userId }, { $set: { authorRequestStatus: "rejected" } });

    return "Author request rejected successfully.";
  }

  async getAuthors(
    paginationQuery: PaginationQueryDto,
    search?: string,
    expertise?: string,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

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
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.userModel.countDocuments(query).exec();

    const data: UserResponseDto[] = plainToInstance(UserResponseDto, authors, {
      excludeExtraneousValues: true,
    });

    return new PaginatedResponseDto(data, { total, limit, offset });
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

    const recipeCount = await this.recipeModel.countDocuments({ author: authorId });

    return {
      authorId,
      followersCount: author.followersCount || 0,
      followingCount: author.followingCount || 0,
      recipesCount: recipeCount,
      totalViews: author.totalViews || 0,
      totalLikes: author.totalLikes || 0,
    };
  }

  async updateAuthorProfile(authorId: string, updateData: Partial<User>): Promise<UserResponseDto> {
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

    await this.userModel.findByIdAndUpdate(authorId, {
      $set: {
        recipesCount: recipeCount,
      },
    });
  }
}
