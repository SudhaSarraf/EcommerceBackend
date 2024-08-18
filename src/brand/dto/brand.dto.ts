import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBrandDto {

    @IsNotEmpty()
    @IsString()
    brandName: string;

    companyId?: number;

   
    userId?: number;

    operatedBy?: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}