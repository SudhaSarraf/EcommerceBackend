import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto} from './dto/category.dto';
import { EntityManager, QueryFailedError } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { error } from 'console';

@Injectable()
export class CategoryService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const categoryEntity = new CategoryEntity(createCategoryDto);
      categoryEntity.status = true;
      const result = await this.entityManager.save(categoryEntity );
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
    return await this.entityManager.find(CategoryEntity,{
      where: {
        companyId: companyId,
        status: true
      }
    });
  }

  async findOne(id: number) {
    const result = await this.entityManager.findOne(CategoryEntity, {
      where: {
        id: id,
      },
    });
    if (!result)
      throw new NotFoundException('No record found for requested category');
    return result;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.findOne(id);
    if (!existingCategory)
      throw new NotFoundException(
        `Brand ${existingCategory} does not exist in database`,
      );
    return await this.entityManager.update(CategoryEntity,{ id: id },{ ...existingCategory, ...updateCategoryDto },
    );
  }

  async remove(id: number) {
    const foundUnit = await this.entityManager.findOne(CategoryEntity, { where: { id: id } });
    if(!foundUnit) throw error;

    const result = await this.entityManager.update(CategoryEntity, id, {
      status: false,
    });
    if( result ) return 'Category removed successfully.';
  }
}
