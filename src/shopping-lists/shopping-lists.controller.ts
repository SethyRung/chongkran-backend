import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ShoppingListsService } from "./shopping-lists.service";
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto";
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ShoppingListDto } from "./dto/shopping-list.dto";
import { GetCurrentUserId } from "src/common/decorators";

@ApiTags("Shopping-List")
@Controller("shopping-lists")
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOkResponse({ type: ShoppingListDto })
  async create(
    @GetCurrentUserId() userId: string,
    @Body() createShoppingListDto: CreateShoppingListDto
  ): Promise<ShoppingListDto> {
    return await this.shoppingListsService.create(
      userId,
      createShoppingListDto
    );
  }

  @ApiBearerAuth()
  @Get()
  @ApiOkResponse({ type: ShoppingListDto })
  async findOne(@GetCurrentUserId() userId: string): Promise<ShoppingListDto> {
    return await this.shoppingListsService.findOne(userId);
  }

  @ApiBearerAuth()
  @Patch()
  @ApiOkResponse({ type: ShoppingListDto })
  async update(
    @GetCurrentUserId() userId: string,
    @Body() updateShoppingListDto: UpdateShoppingListDto
  ): Promise<ShoppingListDto> {
    return await this.shoppingListsService.update(
      userId,
      updateShoppingListDto
    );
  }

  @ApiBearerAuth()
  @Delete()
  @ApiOkResponse({ type: String })
  async remove(@GetCurrentUserId() userId: string): Promise<string> {
    return await this.shoppingListsService.remove(userId);
  }
}
