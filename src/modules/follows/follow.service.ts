import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Follow, FollowDocument } from "@/db/schema/follow.schema";
import { User, UserDocument } from "@/db/schema/user.schema";
import { FollowDto, UnfollowDto } from "./dto/follow.dto";
import { PaginatedResponseDto } from "@/dto/paginated-response.dto";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async follow(followerId: string, followDto: FollowDto): Promise<Follow> {
    const { followingId } = followDto;

    const existingFollow = await this.followModel.findOne({
      follower: followerId,
      following: followingId,
    });

    if (existingFollow) {
      throw new Error("Already following this user");
    }

    if (followerId === followingId) {
      throw new Error("Cannot follow yourself");
    }

    const follow = new this.followModel({
      follower: followerId,
      following: followingId,
    });

    await follow.save();

    await this.userModel.findByIdAndUpdate(followerId, {
      $inc: { followingCount: 1 },
    });

    await this.userModel.findByIdAndUpdate(followingId, {
      $inc: { followersCount: 1 },
    });

    return follow;
  }

  async unfollow(followerId: string, unfollowDto: UnfollowDto): Promise<void> {
    const { followingId } = unfollowDto;

    const follow = await this.followModel.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    if (!follow) {
      throw new Error("Not following this user");
    }

    await this.userModel.findByIdAndUpdate(followerId, {
      $inc: { followingCount: -1 },
    });

    await this.userModel.findByIdAndUpdate(followingId, {
      $inc: { followersCount: -1 },
    });
  }

  async getFollowers(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<any>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const [follows, total] = await Promise.all([
      this.followModel
        .find({ following: userId })
        .populate("follower", "firstName lastName email avatar")
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .exec(),
      this.followModel.countDocuments({ following: userId }),
    ]);

    const data = follows.map((follow) => follow.follower);

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async getFollowing(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<any>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const [follows, total] = await Promise.all([
      this.followModel
        .find({ follower: userId })
        .populate("following", "firstName lastName email avatar")
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .exec(),
      this.followModel.countDocuments({ follower: userId }),
    ]);

    const data = follows.map((follow) => follow.following);

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followModel.findOne({
      follower: followerId,
      following: followingId,
    });

    return !!follow;
  }

  async getFollowStats(userId: string) {
    const followersCount = await this.followModel.countDocuments({
      following: userId,
    });

    const followingCount = await this.followModel.countDocuments({
      follower: userId,
    });

    return {
      followersCount,
      followingCount,
    };
  }
}
