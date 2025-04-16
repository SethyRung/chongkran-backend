import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { UserResponseDto } from "./dto/user_response.dto";
import { plainToInstance } from "class-transformer";
import {
  AuthorRequesDocument,
  AuthorRequest,
} from "./schemas/author_request.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AuthorRequest.name)
    private authorRequestModel: Model<AuthorRequesDocument>
  ) {}
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find();
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
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
