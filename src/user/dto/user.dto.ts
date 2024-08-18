import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
} from 'class-validator';
import { HasMimeType, IsFile, MemoryStoredFile } from 'nestjs-form-data';

export class SignUpUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  active: boolean;

  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsFile()
  @IsOptional()
  image?: MemoryStoredFile;

  // @Transform(({ value }) => (value as string).trim().split(','))
  @Type(() => String)
  @IsArray()
  @IsOptional()
  roles?: string[];

  companyId: number;

  fiscalYear: string;
}

export class UpdateUserDto extends PartialType(SignUpUserDto) {}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
