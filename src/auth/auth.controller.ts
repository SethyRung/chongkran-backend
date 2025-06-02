import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {
  ApiResponse,
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from "src/common/decorators";
import { RtGuard } from "src/common/guards";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { UserResponseDto } from "src/user/dto/user_response.dto";
import { buildResponse } from "src/common/utils/response.util";

@ApiTags("Auth")
@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  @ApiResponse({ type: String })
  async signup(@Body() dto: SignupDto) {
    return buildResponse({ data: await this.authService.signup(dto) });
  }

  @Public()
  @Post("login")
  @ApiResponse({ type: AuthResponseDto })
  async login(@Body() dto: LoginDto) {
    return buildResponse({ data: await this.authService.login(dto) });
  }

  @ApiBearerAuth()
  @Get("/me")
  @ApiResponse({ type: UserResponseDto })
  async findCurrentUser(@GetCurrentUserId() id: string) {
    return buildResponse({ data: await this.authService.findCurrentUser(id) });
  }

  @ApiBearerAuth()
  @Post("logout")
  @ApiResponse({ type: String })
  async logout(@GetCurrentUserId() userId: string) {
    return buildResponse({ data: await this.authService.logout(userId) });
  }

  @Public()
  @ApiBearerAuth()
  @UseGuards(RtGuard)
  @Get("refresh")
  @ApiResponse({ type: AuthResponseDto })
  async refresh(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser("refreshToken") refreshToken: string
  ) {
    return buildResponse({
      data: await this.authService.refresh(userId, refreshToken),
    });
  }
}
