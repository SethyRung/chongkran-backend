import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Follow, FollowDocument } from "./schemas/follow.schema";
import { User, UserDocument } from "../user/schemas/user.schema";
import { FollowDto, UnfollowDto } from "./dto/follow.dto";

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async follow(followerId: string, followDto: FollowDto): Promise<Follow> {
    const { followingId } = followDto;

    // Check if already following
    const existingFollow = await this.followModel.findOne({
      follower: followerId,
      following: followingId,
    });

    if (existingFollow) {
      throw new Error("Already following this user");
    }

    // Check if trying to follow self
    if (followerId === followingId) {
      throw new Error("Cannot follow yourself");
    }

    // Create follow relationship
    const follow = new this.followModel({
      follower: followerId,
      following: followingId,
    });

    await follow.save();

    // Update follower and following counts
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

    // Update follower and following counts
    await this.userModel.findByIdAndUpdate(followerId, {
      $inc: { followingCount: -1 },
    });

    await this.userModel.findByIdAndUpdate(followingId, {
      $inc: { followersCount: -1 },
    });
  }

  async getFollowers(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const follows = await this.followModel
      .find({ following: userId })
      .populate("follower", "firstName lastName email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.followModel.countDocuments({ following: userId });

    return {
      followers: follows.map((follow) => follow.follower),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getFollowing(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const follows = await this.followModel
      .find({ follower: userId })
      .populate("following", "firstName lastName email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.followModel.countDocuments({ follower: userId });

    return {
      following: follows.map((follow) => follow.following),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
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
