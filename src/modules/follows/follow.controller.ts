import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  Request,
  HttpCode,
  HttpStatus,
  Body,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { FollowService } from "./follow.service";
import { FollowDto, UnfollowDto } from "./dto/follow.dto";

@ApiTags("follows")
@Controller("follows")
@ApiBearerAuth()
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  @ApiOperation({ summary: "Follow a user" })
  async follow(@Request() req, @Body() followDto: FollowDto) {
    return this.followService.follow(req.user.sub, followDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Unfollow a user" })
  async unfollow(@Request() req, @Body() unfollowDto: UnfollowDto) {
    await this.followService.unfollow(req.user.sub, unfollowDto);
    return { message: "Successfully unfollowed user" };
  }

  @Get("followers/:userId")
  @ApiOperation({ summary: "Get user's followers" })
  async getFollowers(
    @Param("userId") userId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.followService.getFollowers(userId, page, limit);
  }

  @Get("following/:userId")
  @ApiOperation({ summary: "Get users that user is following" })
  async getFollowing(
    @Param("userId") userId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
  ) {
    return this.followService.getFollowing(userId, page, limit);
  }

  @Get("is-following/:followingId")
  @ApiOperation({ summary: "Check if current user is following another user" })
  async isFollowing(@Request() req, @Param("followingId") followingId: string) {
    const isFollowing = await this.followService.isFollowing(req.user.sub, followingId);
    return { isFollowing };
  }

  @Get("stats/:userId")
  @ApiOperation({ summary: "Get user's follow statistics" })
  async getFollowStats(@Param("userId") userId: string) {
    return this.followService.getFollowStats(userId);
  }
}
