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
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserResponseDto } from "./dto/user_response.dto";
import { GetCurrentUser, GetCurrentUserId } from "src/common/decorators";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { UpdateUserDto } from "./dto/update_user.dto";
import { UserClaim } from "./dto/user_claim.dto";

@ApiTags("Users")
@Controller("/api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get()
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  async findAll(): Promise<UserResponseDto[]> {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @Get("/:id")
  @Roles(Role.Admin)
  @ApiOkResponse({ type: UserResponseDto })
  async findById(@Param("id") id: string): Promise<UserResponseDto> {
    return await this.userService.findById(id);
  }

  @ApiBearerAuth()
  @Patch("/:id")
  @ApiOkResponse({ type: String })
  async updateById(
    @GetCurrentUser()
    currentUser: UserClaim,
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<String> {
    if (currentUser.role !== Role.Admin && currentUser.sub !== id)
      throw new HttpException(
        "Sorry, you don't have permission to update this user's information.",
        HttpStatus.FORBIDDEN
      );
    return await this.userService.updateById(id, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete("/:id")
  @Roles(Role.Admin)
  @ApiOkResponse({ type: String })
  async deleteById(@Param("id") id: string): Promise<String> {
    return await this.userService.deleteById(id);
  }

  @ApiBearerAuth()
  @Put("/become-author")
  @ApiOkResponse({ type: String })
  async becomeAuthor(@GetCurrentUserId() id: string): Promise<string> {
    return await this.userService.becomeAuthor(id);
  }
}
