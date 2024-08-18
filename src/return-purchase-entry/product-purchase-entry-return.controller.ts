import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ProductPurchaseEntryReturnService } from './product-purchase-entry-return.service';
import { CreateProductPurchaseEntryReturnDto } from './dto/purchase-entry-return.dto';

@Controller('return-purchase-entry')
export class ReturnPurchaseEntryController {
  constructor(
    private readonly productPurchaseEntryReturnService: ProductPurchaseEntryReturnService,
  ) {}

  @Post()
  create(@Body() createProductPurchaseEntryReturnDto: CreateProductPurchaseEntryReturnDto, @Req() req: any) {
    // const fiscalYear = req.user.fiscalYear
    const fiscalYear = '2081/82'
    const companyId = 1
    return this.productPurchaseEntryReturnService.create({...createProductPurchaseEntryReturnDto, fiscalYear, companyId});
  }

  // @Get()
  // findAll() {
  //   return this.returnPurchaseEntryService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.returnPurchaseEntryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReturnPurchaseEntryDto: UpdateReturnPurchaseEntryDto) {
  //   return this.returnPurchaseEntryService.update(+id, updateReturnPurchaseEntryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.returnPurchaseEntryService.remove(+id);
  // }
}
