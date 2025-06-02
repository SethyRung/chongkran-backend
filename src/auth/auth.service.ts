import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Role } from "src/common/enums/role.enum";
import { LoginDto } from "./dto/login.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { SignupDto } from "./dto/signup.dto";
import { JwtPayload } from "./types/JwtPayload";
import { UserResponseDto } from "src/user/dto/user_response.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: SignupDto): Promise<String> {
    const user = await this.userModel.findOne({ email: dto.email }).exec();
    if (!!user) throw new ConflictException("Email is alread exists");
    const hash = await bcrypt.hash(dto.password, 10);
    await this.userModel.create({ ...dto, password: hash, role: Role.User });
    return "User successfully created";
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userModel.findOne({ email: dto.email });

    if (!user) throw new ForbiddenException("Email or Password is invalid.");

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches)
      throw new ForbiddenException("Email or Password is invalid.");

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.userModel.updateOne(
      { _id: user.id },
      { $set: { refreshToken: tokens.refreshToken } }
    );

    return tokens;
  }

  async findCurrentUser(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id);
    console.log(user);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async logout(userId: string): Promise<String> {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { refreshToken: "" } }
    );

    return "User successfully logout";
  }

  async refresh(userId: string, rt: string): Promise<AuthResponseDto> {
    const user = await this.userModel.findOne({
      $and: [{ _id: userId }, { refreshToken: rt }],
    });
    if (!user) throw new ForbiddenException("Access Denied");

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.userModel.updateOne(
      { _id: user.id },
      {
        $set: { refreshToken: tokens.refreshToken },
      }
    );

    return tokens;
  }

  async generateTokens(
    userId: string,
    email: string,
    role: string
  ): Promise<AuthResponseDto> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      role: role,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>("ACCESS_TOKEN_SECRET"),
        expiresIn: this.config.get<string>("ACCESS_TOKEN_EXPIRATION"),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>("REFRESH_TOKEN_SECRET"),
        expiresIn: this.config.get<string>("REFRESH_TOKEN_EXPIRATION"),
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
}
