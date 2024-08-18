import { Controller, Get, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AtGuard } from 'src/guards/at.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/role.decorator';

@UseGuards(AtGuard, RoleGuard)
@Roles('admin')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('getAll/page')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('companyId') companyId: number,
  ) {
    return this.inventoryService.findAll(+page, +limit, companyId);
  }

  @Get('getAll')
  findEntire(@Req() req: any) {
    const companyId: number = req.user.companyId;
    return this.inventoryService.findEntireInventory(companyId);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.inventoryService.findOne(+id);
  }
}
