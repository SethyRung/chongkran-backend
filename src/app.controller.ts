import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { Public } from "@/common/decorators/public.decorator";
import { ApiOkResponseWrapper } from "@/common/decorators";

@ApiTags("App")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get("ping")
  @ApiOkResponseWrapper({ type: String })
  ping(): string {
    return this.appService.ping();
  }
}
