import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, Query, UseGuards, } from '@nestjs/common';
import { SalesEntryService } from './sales-entry.service';
import {
  CreateProductIssueDto,
  SearchDto,
  UpdateProductIssueDto,
} from './dto/sales-entry.dto';
import {
  OrderStatus,
  PaymentOption,
} from './entities/sales-entry-master.entity';
import { AtGuard } from 'src/guards/at.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/role.decorator';

@Controller('sales-entry')
export class SalesEntryController {
  constructor(
    private readonly salesEntryService: SalesEntryService,
  ) { }

  @UseGuards(AtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductIssueDto: CreateProductIssueDto) {
    return await this.salesEntryService.create(
      createProductIssueDto,
    );
    // const companyId: number = 1;
    // return await this.salesEntryService.create({ ...createProductIssueDto, companyId: companyId });
  }

  @UseGuards(AtGuard)
  @Get('findAll/:companyId/:paymentOption/:orderStatus')
  async findAll(
    @Param('companyId') companyId: number,
    @Param('orderStatus') orderStatus: OrderStatus,
    @Param('paymentOption') paymentOption: PaymentOption,
  ) {
    return await this.salesEntryService.findAll(
      companyId,
      orderStatus,
      paymentOption,
    );
  }

  @UseGuards(AtGuard)
  @Get('findByUser')
  async findByUser(
    @Query('companyId') companyId: number,
    @Query('orderStatus') orderStatus: OrderStatus,
    @Query('paymentOption') paymentOption: PaymentOption,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.salesEntryService.findByUserId(
      companyId,
      orderStatus,
      paymentOption,
      userId,
    );
  }

  @UseGuards(AtGuard, RoleGuard)
  @Roles('admin')
  @Get('getAllCount')
  async getAllSalesCount(@Req() req:any) {
    const companyId = 1
    return await this.salesEntryService.countAllSales(companyId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.salesEntryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: number, @Body() updateIssuedProductFromStoreDto: UpdateProductIssueDto) {
  //   return this.salesEntryService.update(+id, updateIssuedProductFromStoreDto);
  // }

  @Patch('order/status/:id/:orderStatus/:userId')
  update(@Param('id') id: number, @Param('orderStatus') orderStatus: OrderStatus, @Param('userId') userId: number) {
    return this.salesEntryService.updateOrderStatus(+id, orderStatus, +userId);
  }

  @Patch('cancelBill/:id')
  remove(@Param('id') id: number) {
    return this.salesEntryService.updateCancel(+id);
  }
}
