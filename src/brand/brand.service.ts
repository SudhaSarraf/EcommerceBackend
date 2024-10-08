import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
import { BrandEntity } from './entities/brand.entity';
import { EntityManager, QueryFailedError } from 'typeorm';
import { error } from 'console';

@Injectable()
export class BrandService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createBrandDto: CreateBrandDto) {
    try {
      const brandEntity = new BrandEntity(createBrandDto);
      brandEntity.status = true;
      const result = await this.entityManager.save(BrandEntity, brandEntity);
      return result;
    } catch (error) {
      console.log('error', error);
      if (
        error instanceof QueryFailedError &&
        error.message.includes('Duplicate entry')
      ) {
        throw new ConflictException(
          'Duplicate entry detected: ' + error.message,
        );
      } else {
        throw new InternalServerErrorException(error.message);
      }
          }
  }

  async findAll(companyId: number) {
    return await this.entityManager.find(BrandEntity, {
      where: {
        companyId: companyId,
        status: true
      }
    });
  }

  async findOne(id: number) {
    const result = await this.entityManager.findOne(BrandEntity, {
      where: {
        id: id,
      },
    });
    if (!result)
      throw new NotFoundException('No record found for requested brand');
    return result;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const existingBrand = await this.findOne(id);
    if (!existingBrand)
      throw new NotFoundException(
        `Brand ${existingBrand} does not exist in database`,
      );
    return await this.entityManager.update(
      BrandEntity,
      { id: id },
      { ...existingBrand, ...updateBrandDto },
    );
  }

  async remove(id: number) {
    const foundUnit = await this.entityManager.findOne(BrandEntity, { where: { id: id } });
    if(!foundUnit) throw error;

    const result = await this.entityManager.update(BrandEntity, id, {
      status: false,
    });
    if( result ) return 'Brand removed successfully.';
  }
}
