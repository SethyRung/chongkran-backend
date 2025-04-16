import { Controller, Get, Param, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserResponseDto } from "./dto/user_response.dto";
import { GetCurrentUserId } from "src/common/decorators";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";

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
  @Put("/become-author")
  @ApiOkResponse({ type: String })
  async becomeAuthor(@GetCurrentUserId() id: string): Promise<string> {
    return await this.userService.becomeAuthor(id);
  }
}
