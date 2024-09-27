import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, UpdateCartDto } from './dto/cart.dto';
import { AtGuard } from 'src/guards/at.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  
  @UseGuards(AtGuard)
  @Post('create')
  create(@Body() createCartDto: CreateCartDto, @Req() req: any) {
    const companyId: number = req.user.companyId;
    const userId: number = req.user.userId;
    return this.cartService.create({ ...createCartDto, companyId, userId });
  }

  @UseGuards(AtGuard)
  @Get('getAllByUserId')
  findAll(
    @Req() req: any,
  ) {
    const companyId: number = req.user.companyId;
    const userId: number = req.user.userId;
    return this.cartService.findByUserId(+userId, +companyId);
  }

  
  @UseGuards(AtGuard)
  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.cartService.findOne(+id);
  }

  
  @UseGuards(AtGuard)
  @Get('getProductIds')
  async checkQuantity(@Body() pids: any) {
    console.log('pids', pids);
    return await this.cartService.checkQuantity(pids);
  }

  
  @UseGuards(AtGuard)
  @Patch('update/:id')
  update(
    @Param('id') id: number,
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: any,
  ) {
    const companyId: number = req.user.companyId;
    const userId: number = req.user.userId;
    return this.cartService.update(+id, {
      ...updateCartDto,
      companyId,
      userId,
    });
  }

  @UseGuards(AtGuard)
  @Get('getAllCount')
  async getAllUserCount(@Req() req:any) {
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    return await this.cartService.countAllCart(userId, companyId);
  }

  
  @UseGuards(AtGuard)
  @Delete('remove/:id')
  remove(@Param('id') id: number) {
    return this.cartService.remove(+id);
  }

  @UseGuards(AtGuard)
  @Delete('deleteAll')
  async removeMultiple(@Body('ids') ids: number[]) {
    return this.cartService.removeAll(ids);
  }
}
