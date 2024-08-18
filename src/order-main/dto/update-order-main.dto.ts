import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderMainDto } from './create-order-main.dto';

export class UpdateOrderMainDto extends PartialType(CreateOrderMainDto) {}
