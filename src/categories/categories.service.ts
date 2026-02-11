import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryDto } from "./dto/category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "./schemas/category.schema";
import { Model } from "mongoose";
import { PaginatedResponseDto } from "src/dto/paginated-response.dto";
import { PaginationQueryDto } from "src/dto/pagination-query.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    const currentDate = new Date().toISOString();
    const created = await this.categoryModel.create({
      ...createCategoryDto,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    return {
      id: created._id.toString(),
      name: created.name,
      description: created.description,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async findAll(
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<CategoryDto>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.categoryModel
        .find({ isDeleted: false })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.categoryModel.countDocuments({ isDeleted: false }).exec(),
    ]);

    const data: CategoryDto[] = categories.map((category) => ({
      id: category._id.toString(),
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    return {
      content: data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<CategoryDto> {
    const category = await this.categoryModel
      .findOne({ _id: id, isDeleted: false })
      .exec();

    if (!category) throw new NotFoundException("Category not found.");

    return {
      id: category._id.toString(),
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryDto> {
    const category = await this.categoryModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!category) throw new NotFoundException("Category not found");

    const currentDate = new Date().toISOString();
    Object.assign(category, { ...updateCategoryDto, updateAt: currentDate });
    const updated = await category.save();
    return {
      id: updated._id.toString(),
      name: updated.name,
      description: updated.description,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async remove(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) throw new NotFoundException("Category not found.");

    await category.updateOne({ isDeleted: true });
    return "Category deleted successfully";
  }
}
