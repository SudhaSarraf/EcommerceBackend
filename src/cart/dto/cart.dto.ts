import { PartialType } from "@nestjs/mapped-types";
import { IsDecimal, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from "class-validator";
import { Type } from 'class-transformer';


class ProductDto {
    @IsNotEmpty()
    @IsNumber()
    productId: number;
  
    @IsNotEmpty()
    @Type(() => Number) // Ensures that quantity is correctly parsed as a number
    @IsNumber({ maxDecimalPlaces: 2 }) // Allows only decimal numbers with up to 2 decimal places
    quantity: number;
  
  }
  
  export class CreateCartDto {
    userId: number;

    companyId: number;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[];
  }

export class UpdateCartDto extends PartialType(CreateCartDto) {}
