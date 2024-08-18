import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BillService } from './orderBill.service';
import { CreateBillDto, UpdateBillDto } from './dto/bill.dto';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post('create/bill')
  create(@Body() createBillDto: CreateBillDto) {
    return this.billService.create(createBillDto);
  }

  @Get('findAll/master')
  findAllMaster() {
    return this.billService.findAllMaster();
  }

  @Get('findAll/details/:billId')
  findAllDetails(@Param('billId') billId: number) {
    return this.billService.findAllDetails(billId);
  }

  @Get('findAll/master/:id')
  findOneMaster(id: number) {
    return this.billService.findOne(id);
  }

  @Patch('update/bill/:id')
  update(@Param('id') id: number, @Body() updateBillDto: UpdateBillDto) {
    return this.billService.update(id, updateBillDto);
  }

  @Delete('cancel/:id')
  remove(@Param('id') id: string) {
    return this.billService.remove(+id);
  }
}
