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
import { PaginationQueryDto } from "@/dto/pagination-query.dto";
import { ApiOkResponsePaginated, ApiOkResponseWrapper } from "@/common/decorators";
import { UserResponseDto } from "@/modules/user/dto/user_response.dto";

@ApiTags("Follows")
@Controller("/api/follows")
@ApiBearerAuth()
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  @ApiOperation({ summary: "Follow a user" })
  @ApiOkResponseWrapper({ type: Object })
  async follow(@Request() req, @Body() followDto: FollowDto) {
    return this.followService.follow(req.user.sub, followDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Unfollow a user" })
  @ApiOkResponseWrapper({ type: String })
  async unfollow(@Request() req, @Body() unfollowDto: UnfollowDto) {
    await this.followService.unfollow(req.user.sub, unfollowDto);
    return "Successfully unfollowed user";
  }

  @Get("followers/:userId")
  @ApiOperation({ summary: "Get user's followers" })
  @ApiOkResponsePaginated({ type: UserResponseDto })
  async getFollowers(
    @Param("userId") userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.followService.getFollowers(userId, paginationQuery);
  }

  @Get("following/:userId")
  @ApiOperation({ summary: "Get users that user is following" })
  @ApiOkResponsePaginated({ type: UserResponseDto })
  async getFollowing(
    @Param("userId") userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.followService.getFollowing(userId, paginationQuery);
  }

  @Get("is-following/:followingId")
  @ApiOperation({ summary: "Check if current user is following another user" })
  @ApiOkResponseWrapper({ type: Object })
  async isFollowing(@Request() req, @Param("followingId") followingId: string) {
    const isFollowing = await this.followService.isFollowing(req.user.sub, followingId);
    return { isFollowing };
  }

  @Get("stats/:userId")
  @ApiOperation({ summary: "Get user's follow statistics" })
  @ApiOkResponseWrapper({ type: Object })
  async getFollowStats(@Param("userId") userId: string) {
    return this.followService.getFollowStats(userId);
  }
}
