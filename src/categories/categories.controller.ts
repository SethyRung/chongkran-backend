import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { CategoryDto } from "./dto/category.dto";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @Post()
  @Roles(Role.Admin)
  @ApiOkResponse({ type: CategoryDto })
  async create(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<CategoryDto> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @ApiBearerAuth()
  @Get()
  @ApiOkResponse({ type: CategoryDto, isArray: true })
  async findAll(): Promise<CategoryDto[]> {
    return await this.categoriesService.findAll();
  }

  @ApiBearerAuth()
  @Get(":id")
  @ApiOkResponse({ type: CategoryDto })
  findById(@Param("id") id: string) {
    return this.categoriesService.findById(id);
  }

  @ApiBearerAuth()
  @Patch(":id")
  @Roles(Role.Admin)
  @ApiOkResponse({ type: CategoryDto })
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryDto> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiBearerAuth()
  @Delete(":id")
  @Roles(Role.Admin)
  @ApiOkResponse({ type: String })
  async remove(@Param("id") id: string): Promise<string> {
    return await this.categoriesService.remove(id);
  }
}
