import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/enums/role.enum";
import { CategoryDto } from "./dto/category.dto";
import { ApiPaginatedResponse, ApiResponse, Public } from "@/common/decorators";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";

@ApiTags("Categories")
@Controller("/api/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @Post()
  @Roles(Role.Admin)
  @ApiResponse({ type: CategoryDto })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Public()
  @Get()
  @ApiQuery({ name: "page", type: Number, required: false, default: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, default: 10 })
  @ApiPaginatedResponse({ type: CategoryDto })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.categoriesService.findAll(paginationQuery);
  }

  @Public()
  @Get(":id")
  @ApiResponse({ type: CategoryDto })
  async findById(@Param("id") id: string) {
    return this.categoriesService.findById(id);
  }

  @ApiBearerAuth()
  @Patch(":id")
  @Roles(Role.Admin)
  @ApiResponse({ type: CategoryDto })
  async update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiBearerAuth()
  @Delete(":id")
  @Roles(Role.Admin)
  @ApiResponse({ type: String })
  async remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
