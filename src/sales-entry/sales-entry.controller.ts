import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, } from '@nestjs/common';
import { IssuedProductFromStoreService } from './sales-entry.service';
import { CreateProductIssueDto } from './dto/sales-entry.dto';

@Controller('sales-entry')
export class IssuedProductFromStoreController {
  constructor(
    private readonly issuedProductFromStoreService: IssuedProductFromStoreService,
  ) { }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductIssueDto: CreateProductIssueDto) {
    const companyId: number = 1;
    return await this.issuedProductFromStoreService.create({ ...createProductIssueDto, companyId: companyId });
  }

  // @Get()
  // findAll() {
  //   return this.issuedProductFromStoreService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.issuedProductFromStoreService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIssuedProductFromStoreDto: UpdateIssuedProductFromStoreDto) {
  //   return this.issuedProductFromStoreService.update(+id, updateIssuedProductFromStoreDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.issuedProductFromStoreService.remove(+id);
  // }
}
