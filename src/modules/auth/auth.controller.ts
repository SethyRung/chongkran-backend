import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ApiResponse, GetCurrentUserId, Public } from "@/common/decorators";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { UserResponseDto } from "@/modules/user/dto/user_response.dto";
import { RefreshDto } from "./dto/refresh.dto";

@ApiTags("Auth")
@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  @ApiResponse({ type: String })
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @Post("login")
  @ApiResponse({ type: AuthResponseDto })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @Get("/me")
  @ApiResponse({ type: UserResponseDto })
  async findCurrentUser(@GetCurrentUserId() id: string) {
    return this.authService.findCurrentUser(id);
  }

  @ApiBearerAuth()
  @Post("logout")
  @ApiResponse({ type: String })
  async logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @Post("refresh")
  @ApiBody({ type: RefreshDto })
  @ApiResponse({ type: AuthResponseDto })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }
}
