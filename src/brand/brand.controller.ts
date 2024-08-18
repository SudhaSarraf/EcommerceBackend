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
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
import { Roles } from 'src/guards/role.decorator';
import { AtGuard } from 'src/guards/at.guard';
import { RoleGuard } from 'src/guards/role.guard';

@UseGuards(AtGuard)
@UseGuards(RoleGuard)
@Roles('admin')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('create')
  create(@Body() createBrandDto: CreateBrandDto, @Req() req: any) {
    const companyId: number = req.user.companyId;
    const userId: number = req.user.userId;
    return this.brandService.create({ ...createBrandDto, companyId, userId });
  }

  @Get('getAll')
  findAll(@Req() req: any) {
    const companyId: number = req.user.companyId;
    return this.brandService.findAll(companyId);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @Req() req: any,
  ) {
    const companyId: number = req.user.companyId;
    const userId: number = req.user.userId;
    return this.brandService.update(+id, {
      ...updateBrandDto,
      companyId,
      userId,
    });
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
