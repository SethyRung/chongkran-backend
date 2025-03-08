import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from "src/common/decorators";
import { RtGuard } from "src/common/guards";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { User } from "src/user/schemas/user.schema";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";

@ApiTags("auth")
@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  @ApiResponse({
    status: 201,
    description: "User successfully created",
  })
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto);
  }

  @Public()
  @Post("login")
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @ApiBearerAuth()
  @Post("logout")
  @ApiOkResponse()
  async logout(@GetCurrentUserId() userId: string) {
    return await this.authService.logout(userId);
  }

  @Public()
  @ApiBearerAuth()
  @UseGuards(RtGuard)
  @Get("refresh")
  @ApiOkResponse()
  async refresh(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser("refreshToken") refreshToken: string
  ) {
    return await this.authService.refresh(userId, refreshToken);
  }
}
