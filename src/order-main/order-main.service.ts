import { Injectable } from '@nestjs/common';
import { CreateOrderMainDto } from './dto/create-order-main.dto';
import { UpdateOrderMainDto } from './dto/update-order-main.dto';

@Injectable()
export class OrderMainService {
  create(createOrderMainDto: CreateOrderMainDto) {
    return 'This action adds a new orderMain';
  }

  findAll() {
    return `This action returns all orderMain`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderMain`;
  }

  update(id: number, updateOrderMainDto: UpdateOrderMainDto) {
    return `This action updates a #${id} orderMain`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderMain`;
  }
}
