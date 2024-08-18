import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderMainService } from './order-main.service';
import { CreateOrderMainDto } from './dto/create-order-main.dto';
import { UpdateOrderMainDto } from './dto/update-order-main.dto';

@Controller('order-main')
export class OrderMainController {
  constructor(private readonly orderMainService: OrderMainService) {}

  @Post()
  create(@Body() createOrderMainDto: CreateOrderMainDto) {
    return this.orderMainService.create(createOrderMainDto);
  }

  @Get()
  findAll() {
    return this.orderMainService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderMainService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderMainDto: UpdateOrderMainDto) {
    return this.orderMainService.update(+id, updateOrderMainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderMainService.remove(+id);
  }
}
