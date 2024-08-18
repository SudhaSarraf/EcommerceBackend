import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AtGuard } from 'src/guards/at.guard';
import { Roles } from 'src/guards/role.decorator';
import { Request, Response } from 'express';

@UseGuards(AtGuard)
@UseGuards(RoleGuard)
@Roles('admin')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: any) {
    const companyId: number = req.user.companyId;
    const userId: number = req.user.userId;
    return this.categoryService.create({
      ...createCategoryDto,
      companyId,
      userId,
    });
  }

  @Get('getAll')
  findAll(@Req() req: any) {
    const companyId: number = req.user.companyId;
    return this.categoryService.findAll(companyId);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: any,
  ) {
    const companyId: number = req.user.companyId;
    const userId: number = req.user.userId;
    return this.categoryService.update(+id, {
      ...updateCategoryDto,
      companyId,
      userId,
    });
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
