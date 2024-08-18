import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsNotEmpty()
    @IsString()
    categoryName: string;

    companyId?: number;

    userId?: number;

    operatedBy?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

