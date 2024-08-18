import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
} from 'class-validator';
import {
  OrderStatus,
  PaymentStatus,
  PaymentOption,
} from '../entities/orderBill-master.entity';

export class CreateBillDto {
  @IsDateString()
  orderDate: string;

  @IsNumber()
  userId: string;

  @IsNumber()
  subTotal: number;

  @IsNumber()
  vat: number;

  @IsNumber()
  vatAmt: number;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  discount: number;

  @IsNumber()
  discountAmt: number;

  @IsNumber()
  grandTotal: number;

  @IsNumber()
  paid: number;

  @IsNumber()
  due: number;

  @IsString()
  paymentType: PaymentOption;

  @IsString()
  PaymentStatus: PaymentStatus;

  @IsBoolean()
  status: boolean;

  @IsString()
  paymentPlace: string;

  @IsString()
  orderStatus: OrderStatus;

  @IsString()
  file: string;

  @IsString()
  fiscalYear: string;

  @IsArray()
  billItemsDetails: CreateBillItemDto[];
}

export class CreateBillItemDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  rate: number;

  @IsNumber()
  total: number;
}

export class UpdateBillDto extends PartialType(CreateBillDto) {
  @IsNumber()
  billId: number;

  @IsNumber()
  billNo: number;

  @IsString()
  voucherNo: string;
}
