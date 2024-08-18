import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { UpdateWishlistDto, WishlistDto } from './dto/wishlist.dto';
import { AtGuard } from 'src/guards/at.guard';

@UseGuards(AtGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('create')
  create(@Body() wishlistDto: WishlistDto, @Req() req: any) {
    const companyId: number = req.user.companyId;
    const userId: number = req.user.userId;
    return this.wishlistService.create({...wishlistDto, companyId, userId});
  }

  @Get('getAll')
  findAll(
    @Req() req: any,
  ) {
    const companyId: number = req.user.companyId;
    return this.wishlistService.findAll(+companyId);
  }

  @Get('getByUserId')
  findByUserId(
    @Req() req: any,
  ) {
    const companyId: number = req.user.companyId;
    const userId: number = req.user.userId;
    return this.wishlistService.findByUserId(
      +userId,
      +companyId,
    );
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.wishlistService.findOne(+id);
  }

  @Get('countByProduct/:productId')
  async countWishlistsByProductId(
    @Param('productId') productId: number,
  ): Promise<{ count: number }> {
    const count =
      await this.wishlistService.countWishlistsByProductId(+productId);
    return { count };
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.wishlistService.remove(+id);
  }
}
