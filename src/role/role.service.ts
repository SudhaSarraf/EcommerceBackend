import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>
  ) { }
  async create(createRoleDto: CreateRoleDto) {
    const createdRole = await this.roleRepository.save(new RoleEntity(createRoleDto));
    return createdRole;
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(name: string) {
    const foundRole = await this.roleRepository.findOneBy({ name: name });
    if (!foundRole) throw new NotFoundException("No record found for requested role.");
    return foundRole;

  }

  async update(name: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(name);
    if (!role) throw new NotFoundException(`role ${name} does not exist in database`);
    return await this.roleRepository.update({ name: name }, { ...role, ...updateRoleDto });
  }

  async remove(name: string) {
    return await this.roleRepository.softRemove({ name: name });
  }
}
