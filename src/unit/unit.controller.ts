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
import { UnitService } from './unit.service';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { AtGuard } from 'src/guards/at.guard';
import { Roles } from 'src/guards/role.decorator';

@UseGuards(AtGuard)
@UseGuards(RoleGuard)
@Roles('admin')
@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post('create')
  create(@Body() createUnitDto: CreateUnitDto, @Req() req: any) {
    const companyId: number = req.user.companyId;
    const userId: number = req.user.userId;
    return this.unitService.create({ ...createUnitDto, companyId, userId });
  }

  @Get('getAll')
  findAll(@Req() req: any) {
    const companyId: number = req.user.companyId;
    return this.unitService.findAll(companyId);
  }

  @Get('getById/:id')
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
    @Req() req: any,
  ) {
    const companyId: number = req.user.companyId;
    const userId: number = req.user.userId;
    return this.unitService.update(+id, {
      ...updateUnitDto,
      companyId,
      userId,
    });
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.unitService.remove(+id);
  }
}
