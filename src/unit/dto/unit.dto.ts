import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUnitDto {

    @IsNotEmpty()
    @IsString()
    unitName: string;

    companyId?: number;

  
    userId?: number;

    operatedBy?: string;
}

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}

