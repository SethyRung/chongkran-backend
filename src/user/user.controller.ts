import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserResponseDto } from "./dto/user_response.dto";
import {
  ApiPaginatedResponse,
  ApiResponse,
  GetCurrentUser,
  GetCurrentUserId,
} from "src/common/decorators";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { UpdateUserDto } from "./dto/update_user.dto";
import { UpdateAuthorProfileDto } from "./dto/update-author-profile.dto";
import { UserClaim } from "./dto/user_claim.dto";
import { PaginationQueryDto } from "src/dto/pagination-query.dto";
import { buildResponse } from "src/common/utils/response.util";

@ApiTags("Users")
@Controller("/api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get()
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  @ApiPaginatedResponse({ type: UserResponseDto })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return buildResponse({
      data: await this.userService.findAll(paginationQuery),
    });
  }

  @ApiBearerAuth()
  @Get("/:id")
  @Roles(Role.Admin)
  @ApiResponse({ type: UserResponseDto })
  async findById(@Param("id") id: string) {
    return buildResponse({ data: await this.userService.findById(id) });
  }

  @ApiBearerAuth()
  @Patch("/:id")
  @ApiResponse({ type: String })
  async updateById(
    @GetCurrentUser()
    currentUser: UserClaim,
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    if (currentUser.role !== Role.Admin && currentUser.sub !== id)
      throw new HttpException(
        "Sorry, you don't have permission to update this user's information.",
        HttpStatus.FORBIDDEN
      );
    return buildResponse({
      data: await this.userService.updateById(id, updateUserDto),
    });
  }

  @ApiBearerAuth()
  @Delete("/:id")
  @Roles(Role.Admin)
  @ApiResponse({ type: String })
  async deleteById(@Param("id") id: string) {
    return buildResponse({ data: await this.userService.deleteById(id) });
  }

  @ApiBearerAuth()
  @Put("/become-author")
  @ApiResponse({ type: String })
  async becomeAuthor(@GetCurrentUserId() id: string) {
    return buildResponse({ data: await this.userService.becomeAuthor(id) });
  }

  @ApiBearerAuth()
  @Get("/authors")
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  @ApiQuery({ name: "search", type: String, required: false })
  @ApiQuery({ name: "expertise", type: String, required: false })
  @ApiPaginatedResponse({ type: UserResponseDto })
  async getAuthors(
    @Query() paginationQuery: PaginationQueryDto,
    @Query("search") search?: string,
    @Query("expertise") expertise?: string
  ) {
    return buildResponse({
      data: await this.userService.getAuthors(
        paginationQuery,
        search,
        expertise
      ),
    });
  }

  @ApiBearerAuth()
  @Get("/authors/popular")
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  @ApiResponse({ type: UserResponseDto, isArray: true })
  async getPopularAuthors(@Query("limit") limit: number = 10) {
    return buildResponse({
      data: await this.userService.getPopularAuthors(limit),
    });
  }

  @ApiBearerAuth()
  @Get("/authors/search")
  @ApiQuery({ name: "q", type: String, required: true })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 20 })
  @ApiResponse({ type: UserResponseDto, isArray: true })
  async searchAuthors(
    @Query("q") query: string,
    @Query("limit") limit: number = 20
  ) {
    return buildResponse({
      data: await this.userService.searchAuthors(query, limit),
    });
  }

  @ApiBearerAuth()
  @Get("/authors/:id")
  @ApiResponse({ type: UserResponseDto })
  async getAuthorById(@Param("id") id: string) {
    return buildResponse({ data: await this.userService.getAuthorById(id) });
  }

  @ApiBearerAuth()
  @Get("/authors/:id/stats")
  @ApiResponse({ type: Object })
  async getAuthorStats(@Param("id") id: string) {
    return buildResponse({ data: await this.userService.getAuthorStats(id) });
  }

  @ApiBearerAuth()
  @Patch("/authors/:id/profile")
  @ApiOperation({ summary: "Update author profile" })
  @ApiBody({ type: UpdateAuthorProfileDto })
  @ApiResponse({ type: UserResponseDto })
  async updateAuthorProfile(
    @GetCurrentUser() currentUser: UserClaim,
    @Param("id") id: string,
    @Body() updateData: UpdateAuthorProfileDto
  ) {
    if (currentUser.role !== Role.Admin && currentUser.sub !== id) {
      throw new HttpException(
        "Sorry, you don't have permission to update this author's profile.",
        HttpStatus.FORBIDDEN
      );
    }
    return buildResponse({
      data: await this.userService.updateAuthorProfile(id, updateData),
    });
  }
}
