import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AuthorRequest.name)
    private authorRequestModel: Model<AuthorRequesDocument>
  ) {}
  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find({
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel
        .countDocuments({
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        })
        .exec(),
    ]);

    const data: UserResponseDto[] = plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });

    return {
      data,
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
}
