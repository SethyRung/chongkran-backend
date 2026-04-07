import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto";
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto";
import { ShoppingListDto } from "./dto/shopping-list.dto";
import { InjectModel } from "@nestjs/mongoose";
import { ShoppingList, ShoppingListDocument } from "@/db/schema/shopping-list.schema";
import { Model } from "mongoose";

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectModel(ShoppingList.name)
    private shoppingListModel: Model<ShoppingListDocument>,
  ) {}

  async create(
    userId: string,
    createShoppingListDto: CreateShoppingListDto,
  ): Promise<ShoppingListDto> {
    const shoppingItem = await this.shoppingListModel.findOne({ userId }).exec();
    if (shoppingItem) throw new HttpException("List is already exist", HttpStatus.BAD_REQUEST);

    const created = await this.shoppingListModel.create({
      ...createShoppingListDto,
      userId,
    });

    return {
      id: created._id.toString(),
      userId,
      items: created.items.map((shoppingItem) => ({
        name: shoppingItem.name,
        quantity: shoppingItem.quantity,
        checked: shoppingItem.checked,
      })),
      createdAt: created.createdAt,
    };
  }

  async findOne(userId: string): Promise<ShoppingListDto> {
    const shoppingItem = await this.shoppingListModel.findOne({ userId }).exec();

    if (!shoppingItem) throw new NotFoundException("List not found.");

    return {
      id: shoppingItem._id.toString(),
      userId,
      items: shoppingItem.items.map((shoppingItem) => ({
        name: shoppingItem.name,
        quantity: shoppingItem.quantity,
        checked: shoppingItem.checked,
      })),
      createdAt: shoppingItem.createdAt,
    };
  }

  async update(
    userId: string,
    updateShoppingListDto: UpdateShoppingListDto,
  ): Promise<ShoppingListDto> {
    const shoppingItem = await this.shoppingListModel.findOne({ userId }).exec();
    if (!shoppingItem) throw new NotFoundException("List not found");

    Object.assign(shoppingItem, { ...updateShoppingListDto });
    const updated = await shoppingItem.save();
    return {
      id: updated._id.toString(),
      userId,
      items: updated.items.map((shoppingItem) => ({
        name: shoppingItem.name,
        quantity: shoppingItem.quantity,
        checked: shoppingItem.checked,
      })),
      createdAt: updated.createdAt,
    };
  }

  async remove(userId: string): Promise<string> {
    const review = await this.shoppingListModel.findById({ userId }).exec();
    if (!review) throw new NotFoundException("List not found.");

    await review.deleteOne();
    return "List deleted successfully";
  }
}
