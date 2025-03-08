import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserResponseDto } from "./dto/user_response.dto";

@ApiTags("User")
@Controller("/api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get()
  @ApiOkResponse({ type: UserResponseDto })
  async findAll(): Promise<UserResponseDto[]> {
    return await this.userService.findAll();
  }
}
