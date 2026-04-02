import { Controller, Get, Post, Body, Patch, Delete } from "@nestjs/common";
import { ShoppingListsService } from "./shopping-lists.service";
import { CreateShoppingListDto } from "./dto/create-shopping-list.dto";
import { UpdateShoppingListDto } from "./dto/update-shopping-list.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ShoppingListDto } from "./dto/shopping-list.dto";
import { ApiOkResponseWrapper, GetCurrentUserId } from "@/common/decorators";

@ApiTags("Shopping-List")
@Controller("/api/shopping-lists")
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOkResponseWrapper({ type: ShoppingListDto })
  async create(
    @GetCurrentUserId() userId: string,
    @Body() createShoppingListDto: CreateShoppingListDto,
  ) {
    return this.shoppingListsService.create(userId, createShoppingListDto);
  }

  @ApiBearerAuth()
  @Get()
  @ApiOkResponseWrapper({ type: ShoppingListDto })
  async findOne(@GetCurrentUserId() userId: string) {
    return this.shoppingListsService.findOne(userId);
  }

  @ApiBearerAuth()
  @Patch()
  @ApiOkResponseWrapper({ type: ShoppingListDto })
  async update(
    @GetCurrentUserId() userId: string,
    @Body() updateShoppingListDto: UpdateShoppingListDto,
  ) {
    return this.shoppingListsService.update(userId, updateShoppingListDto);
  }

  @ApiBearerAuth()
  @Delete()
  @ApiOkResponseWrapper({ type: String })
  async remove(@GetCurrentUserId() userId: string) {
    return this.shoppingListsService.remove(userId);
  }
}
