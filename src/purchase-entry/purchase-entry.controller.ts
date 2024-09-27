import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PurchaseEntryService } from './purchase-entry.service';
import {
  CreateProductPurchaseEntryDto,
  UpdateProductPurchaseEntryDto,
} from './dto/product-purchase-entry.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/role.decorator';
import { AtGuard } from 'src/guards/at.guard';

@UseGuards(AtGuard,RoleGuard)
@Roles('admin')
@Controller('purchase')
export class PurchaseEntryController {
  constructor(private readonly purchaseEntryService: PurchaseEntryService) {}

  @Post('create')
  async create(@Body() createProductPurchaseEntryDto: any, @Req() req:any) {
    const companyId: number = req.user.companyId;
    return await this.purchaseEntryService.create({
      ...createProductPurchaseEntryDto,
      companyId,
    });
  }

  @Get('getAll/master')
  async findAllProductEntry(@Req() req: any) {
    const companyId: number = req.user.companyId;
    return this.purchaseEntryService.findAllPurchaseMaster(companyId);
  }

  @Get('getAll/details/:masterId')
  findAllDetails(@Req() req: any, @Param('masterId') masterId: number) {
    const companyId: number = req.user.companyId;
    return this.purchaseEntryService.findAllDetails(companyId, masterId);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.purchaseEntryService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: number,
    @Body() purchase: UpdateProductPurchaseEntryDto,
  ) {
    return this.purchaseEntryService.update(+id, purchase);
  }

  @UseGuards(AtGuard, RoleGuard)
  @Roles('admin')
  @Get('getAllCount')
  async getAllPurchaseCount(@Req() req:any) {
    const companyId = 1
    return await this.purchaseEntryService.countAllPurchase(companyId);
  }
}
