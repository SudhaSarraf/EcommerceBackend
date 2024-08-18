import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReturnIssuedProductFromStoreService } from './return-issued-product-from-store.service';
import { CreateReturnIssuedProductFromStoreDto } from './dto/create-return-issued-product-from-store.dto';
import { UpdateReturnIssuedProductFromStoreDto } from './dto/update-return-issued-product-from-store.dto';

@Controller('return-issued-product-from-store')
export class ReturnIssuedProductFromStoreController {
  constructor(private readonly returnIssuedProductFromStoreService: ReturnIssuedProductFromStoreService) {}

  @Post()
  create(@Body() createReturnIssuedProductFromStoreDto: CreateReturnIssuedProductFromStoreDto) {
    return this.returnIssuedProductFromStoreService.create(createReturnIssuedProductFromStoreDto);
  }

  @Get()
  findAll() {
    return this.returnIssuedProductFromStoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.returnIssuedProductFromStoreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReturnIssuedProductFromStoreDto: UpdateReturnIssuedProductFromStoreDto) {
    return this.returnIssuedProductFromStoreService.update(+id, updateReturnIssuedProductFromStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.returnIssuedProductFromStoreService.remove(+id);
  }
}
