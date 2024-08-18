import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/guards/role.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { UpdatePasswordDto, UpdateUserDto } from './dto/user.dto';
import { AtGuard } from 'src/guards/at.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @UseGuards(AtGuard, RoleGuard)
  @Roles('admin')
  @Get('getAll')
  async getAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(AtGuard, RoleGuard)
  @Roles('admin')
  @Get('getAllCount')
  async getAllUserCount(@Req() req:any) {
    const companyId = 1
    return await this.usersService.countAllUser(companyId);
  }

  @UseGuards(AtGuard)
  // @UseGuards(RoleGuard)
  // @Roles('admin')
  @Patch('update')
  @FormDataRequest()
  async update( @Body() updateUserDto: UpdateUserDto, @Req() req:any) {
    const id = req.user.userId;
    const user = await this.usersService.update(id, updateUserDto);
    if (!user) new HttpException('Failed to update user data', 500);
    const { userId, firstName, lastName, email, roles } = user;
    return { userId, firstName, lastName, email, roles };
  }

  @UseGuards(AtGuard)
  @Patch('updatePassword')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto, @Req() req:any
  ) {
    const id = req.user.id;
    return await this.usersService.updatePassword(id, updatePasswordDto);
  }

  @UseGuards(AtGuard)
  @Get('getById')
  async findOne(@Req() req:any) {
    const id = req.user.userId;
    if (id === null || '') throw new ForbiddenException();
    const user = await this.usersService.findOne(id);
    if (!user) throw new HttpException('User not found', 400);
    return user;
  }

  @UseGuards(AtGuard)
  @UseGuards(RoleGuard)
  @Roles('admin')
  @Delete('delete')
  remove(@Req() req:any) {
    const id = req.user.userId;
    return this.usersService.remove(id);
  }

  @UseGuards(AtGuard)
  @UseGuards(RoleGuard)
  @Roles('admin')
  @Get('getByEmail/:email')
  async getByEmail(@Param('email') email: string) {
    const user = this.usersService.findByEmail(email);
    if (!user) throw new HttpException('User not found', 400);
    return user;
  }
}
