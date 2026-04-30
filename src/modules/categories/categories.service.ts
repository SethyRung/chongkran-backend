import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryDto } from "./dto/category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "@/db/schema/category.schema";
import { Model } from "mongoose";
import { PaginatedResponseDto } from "@/dto/paginated-response.dto";
import { PaginationQueryDto } from "@/dto/pagination-query.dto";

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    const currentDate = new Date().toISOString();
    const created = await this.categoryModel.create({
      ...createCategoryDto,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    return created.toJSON() as unknown as CategoryDto;
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<CategoryDto>> {
    const { offset = 0, limit = 10 } = paginationQuery;

    const [categories, total] = await Promise.all([
      this.categoryModel.find({ isDeleted: false }).skip(offset).limit(limit).exec(),
      this.categoryModel.countDocuments({ isDeleted: false }).exec(),
    ]);

    const data = categories.map((category) => category.toJSON() as unknown as CategoryDto);

    return new PaginatedResponseDto(data, { total, limit, offset });
  }

  async findById(id: string): Promise<CategoryDto> {
    const category = await this.categoryModel.findOne({ _id: id, isDeleted: false }).exec();

    if (!category) throw new NotFoundException("Category not found.");

    return category.toJSON() as unknown as CategoryDto;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.categoryModel.findOne({ _id: id, isDeleted: false }).exec();
    if (!category) throw new NotFoundException("Category not found");

    const currentDate = new Date().toISOString();
    Object.assign(category, { ...updateCategoryDto, updateAt: currentDate });
    const updated = await category.save();
    return updated.toJSON() as unknown as CategoryDto;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) throw new NotFoundException("Category not found.");

    await category.updateOne({ isDeleted: true });
    return "Category deleted successfully";
  }
}
