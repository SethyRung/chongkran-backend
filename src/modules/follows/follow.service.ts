import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "@/db/schema/user.schema";
import { FollowDto, UnfollowDto } from "./dto/follow.dto";
import { PaginatedResponseDto } from "@/dto/paginated-response.dto";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";
import { UserResponseDto } from "@/modules/user/dto/user_response.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class FollowService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async follow(followerId: string, followDto: FollowDto): Promise<{ message: string }> {
    const { followingId } = followDto;
    const followerObjectId = new Types.ObjectId(followerId);
    const followingObjectId = new Types.ObjectId(followingId);

    if (followerId === followingId) {
      throw new Error("Cannot follow yourself");
    }

    const [follower, following] = await Promise.all([
      this.userModel.findById(followerId).exec(),
      this.userModel.findById(followingId).exec(),
    ]);

    if (!follower || !following) {
      throw new Error("User not found");
    }

    if (follower.following.some((id) => id.equals(followingObjectId))) {
      throw new Error("Already following this user");
    }

    await Promise.all([
      this.userModel.findByIdAndUpdate(followerId, {
        $addToSet: { following: followingObjectId },
        $inc: { followingCount: 1 },
      }),
      this.userModel.findByIdAndUpdate(followingId, {
        $addToSet: { followers: followerObjectId },
        $inc: { followersCount: 1 },
      }),
    ]);

    return { message: "Successfully followed user" };
  }

  async unfollow(followerId: string, unfollowDto: UnfollowDto): Promise<void> {
    const { followingId } = unfollowDto;
    const followerObjectId = new Types.ObjectId(followerId);
    const followingObjectId = new Types.ObjectId(followingId);

    const [follower, following] = await Promise.all([
      this.userModel.findById(followerId).exec(),
      this.userModel.findById(followingId).exec(),
    ]);

    if (!follower || !following) {
      throw new Error("User not found");
    }

    if (!follower.following.some((id) => id.equals(followingObjectId))) {
      throw new Error("Not following this user");
    }

    await Promise.all([
      this.userModel.findByIdAndUpdate(followerId, {
        $pull: { following: followingObjectId },
        $inc: { followingCount: -1 },
      }),
      this.userModel.findByIdAndUpdate(followingId, {
        $pull: { followers: followerObjectId },
        $inc: { followersCount: -1 },
      }),
    ]);
  }

  async getFollowers(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const user = await this.userModel.findById(userId).select("followers").exec();
    if (!user) {
      throw new Error("User not found");
    }

    const followerIds = user.followers || [];
    const total = followerIds.length;
    const paginatedIds = followerIds.slice(offset, offset + limit);

    const followers = paginatedIds.length
      ? await this.userModel
          .find({ _id: { $in: paginatedIds } })
          .select("firstName lastName email avatar")
          .exec()
      : [];

    const data: UserResponseDto[] = plainToInstance(UserResponseDto, followers, {
      excludeExtraneousValues: true,
    });

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async getFollowing(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const user = await this.userModel.findById(userId).select("following").exec();
    if (!user) {
      throw new Error("User not found");
    }

    const followingIds = user.following || [];
    const total = followingIds.length;
    const paginatedIds = followingIds.slice(offset, offset + limit);

    const following = paginatedIds.length
      ? await this.userModel
          .find({ _id: { $in: paginatedIds } })
          .select("firstName lastName email avatar")
          .exec()
      : [];

    const data: UserResponseDto[] = plainToInstance(UserResponseDto, following, {
      excludeExtraneousValues: true,
    });

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const user = await this.userModel.findById(followerId).select("following").exec();
    if (!user) return false;
    return user.following.some((id) => id.equals(new Types.ObjectId(followingId)));
  }

  async getFollowStats(userId: string) {
    const user = await this.userModel.findById(userId).select("followers following").exec();
    if (!user) {
      throw new Error("User not found");
    }
    return {
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    };
  }
}
