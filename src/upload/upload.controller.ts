import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { UploadDto } from "./dto/upload.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ApiResponse } from "src/common/decorators";
import { buildResponse } from "src/common/utils/response.util";

@ApiTags("Upload")
@Controller("/api/upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiBearerAuth()
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({ type: UploadDto })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return buildResponse({ data: await this.uploadService.uploadImage(file) });
  }
}
