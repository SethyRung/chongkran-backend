/// <reference types="multer" />
import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { UploadDto } from "./dto/upload.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ApiOkResponseWrapper } from "@/common/decorators";

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
  @ApiOkResponseWrapper({ type: UploadDto })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }
}
