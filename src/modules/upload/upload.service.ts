/// <reference types="multer" />
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CloudinaryService } from "@/modules/cloudinary/cloudinary.service";
import { UploadDto } from "./dto/upload.dto";

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadDto> {
    const result = await this.cloudinaryService.uploadFile(file);
    if (!result)
      throw new HttpException(
        "The file could not be uploaded. Please try again.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return {
      url: result["secure_url"],
      public_id: result["public_id"],
    };
  }
}
