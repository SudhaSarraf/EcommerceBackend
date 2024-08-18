import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsArray } from 'class-validator';

export class WishlistDto {
    @IsNumber()
    companyId: number;

    @IsNumber()
    userId: number;

    @IsBoolean()
    status: boolean;

    @IsNumber()
    @IsOptional()
    productId?: number;
}

export class UpdateWishlistDto extends PartialType(WishlistDto) {}
