import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsDecimal, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { OrderStatus, PaymentOption } from '../entities/sales-entry-master.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductIssueDto {

  @IsInt()
  userId: number;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  miti: string;

  @IsString()
  billingAddress: string;

  @IsString()
  note: string;

  @IsString()
  fiscalYear: string;

  @IsNumber()
  discPc: number

  @IsNumber()
  tax: number

  @IsEnum(PaymentOption)
  paymentOption: PaymentOption;

  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @IsArray()
  @ValidateNested({ each: false })
  @Type(() => ProductDto)
  products: ProductDto[];

}

export class ProductDto extends PartialType(CreateProductIssueDto) {

  @IsNumber()
  productId: number;

  // @IsString()
  productName: string;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  brandId: number;

  @IsDecimal()
  quantity: number;

  @IsNumber()
  unitId: number;

  @IsDecimal()
  pricePerUnit: number;

  @IsDecimal()
  totalPrice: number;

  @IsBoolean()
  status: boolean;

  @IsNumber()
  updatedTimes: number;

  @IsNumber() // this is salers company id
  companyId: number
}


export class UpdateProductIssueDto {

  @IsInt()
  userId: number;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  miti: string;

  @IsString()
  billingAddress: string;

  @IsString()
  note: string;

  @IsString()
  fiscalYear: string;

  @IsNumber()
  discPc: number

  @IsNumber()
  tax: number

  @IsEnum(PaymentOption)
  paymentOption: PaymentOption;

  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @IsArray()
  @ValidateNested({ each: false })
  @Type(() => ProductDto)
  products: ProductDto[];

}

export class SearchDto {

  @IsNumber() // this is salers company id
  companyId: number

  @IsEnum(PaymentOption)
  paymentOption: PaymentOption;

  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}


// export class CreateProductIssueDto {

//   @IsInt()
//   userId: number;

//   @IsDate()
//   @Type(() => Date)
//   date: Date;

//   @IsString()
//   miti: string;

//   @IsString()
//   billingAddress: string;

//   @IsString()
//   note: string;

//   @IsString()
//   fiscalYear: string;

//   companyId: number

//   @IsArray()
//   @ValidateNested({ each: false })
//   @Type(() => SalerDataDto)
//   salerData: SalerDataDto[];
// }

// export class SalerDataDto extends PartialType(CreateProductIssueDto) {

//   @IsNumber()
//   companyId: number;

//   @IsNumber()
//   total: number;

//   @IsNumber()
//   discPc: number;

//   @IsNumber()
//   discAmt: number;

//   @IsNumber()
//   subTotal: number;

//   @IsNumber()
//   tax: number;

//   @IsNumber()
//   taxAmount: number;

//   @IsNumber()
//   netTotal: number;

//   @IsString()
//   inWords: string;

//   @IsEnum(PaymentOption)
//   paymentOption: PaymentOption;

//   @IsEnum(OrderStatus)
//   orderStatus: OrderStatus;

//   @IsArray()
//   @ValidateNested({ each: false })
//   @Type(() => ProductDto)
//   products: ProductDto[];
// }

// export class ProductDto extends PartialType(SalerDataDto) {

//   @IsNumber()
//   productId: number;

//   @IsNumber()
//   categoryId: number;

//   @IsNumber()
//   brandId: number;

//   @IsDecimal({ decimal_digits: '4' })
//   quantity: number;

//   @IsNumber()
//   unitId: number;

//   @IsDecimal({ decimal_digits: '4' })
//   pricePerUnit: number;

//   @IsDecimal({ decimal_digits: '4' })
//   totalPrice: number;

//   @IsBoolean()
//   status: boolean;

//   @IsNumber()
//   updatedTimes: number;
// }
