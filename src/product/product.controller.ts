import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Roles } from 'src/guards/role.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { AtGuard } from 'src/guards/at.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AtGuard)
  @UseGuards(RoleGuard)
  @Roles('admin')
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() createProductDto: any,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    const companyId: number = req.user.companyId;
    const creatorId: number = 4;
    return this.productService.create({
      ...createProductDto,
      companyId,
      creatorId,
      images: images,
    });
  }

  @Get('getAll/page')
  async findAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
  ) {
    const companyId: number = 1;
    return await this.productService.findAll(+page, +limit, companyId);
  }

  @Get('getAll')
  async findEntireProducts(@Req() req: Request) {
    const companyId: number = 1;
    return await this.productService.findEntireProduct(companyId);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Get('/getByCategory/:categoryId')
  async findByAdsCategory(@Param('categoryId') categoryId: number) {
    return await this.productService.findByCategory(+categoryId);
  }

  @Get('/getByBrand/:brandId')
  async findByAdsBrand(@Param('brandId') brandId: number) {
    return await this.productService.findByBrand(+brandId);
  }

  @UseGuards(AtGuard)
  @UseGuards(RoleGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images'))
  @Patch('update/:id')
  update(
    @Param('id') id: number,
    @Body() updateProductDto: any,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    const companyId: number = req.user.companyId;
    const creatorId: number = 4;

    return this.productService.update({
      ...updateProductDto,
      images: images,
      companyId,
      creatorId,
      id: +id,
    });
  }

  @UseGuards(AtGuard, RoleGuard)
  @Roles('admin')
  @Delete('delete/:productId')
  remove(@Param('productId') productId: number) {
    return this.productService.remove(productId);
  }
}
