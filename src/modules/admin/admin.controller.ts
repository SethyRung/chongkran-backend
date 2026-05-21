import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { AdminStatsResponseDto } from "./dto/admin-stats-response.dto";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/enums/role.enum";
import { ApiOkResponseWrapper } from "@/common/decorators";

@ApiTags("Admin")
@ApiBearerAuth()
@Controller("/api/admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("/stats")
  @Roles(Role.Admin)
  @ApiOperation({ summary: "Get admin dashboard statistics" })
  @ApiOkResponseWrapper({ type: AdminStatsResponseDto })
  async getStats(): Promise<AdminStatsResponseDto> {
    return this.adminService.getStats();
  }
}
