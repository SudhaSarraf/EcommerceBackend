import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { EntityManager } from 'typeorm';
import { InventoryEntity } from './entities/inventory.entity';
import { EntityNotFoundException } from 'src/common/errors/entityNotFoundException';

@Injectable()
export class InventoryService {
  constructor(private readonly entityManager: EntityManager) {}

  async findAll(page: number, limit: number, companyId: number) {
    try {
      const skip = (page - 1) * limit;
      const [inventoryData, total] = await this.entityManager.findAndCount(
        InventoryEntity,
        {
          where: {
            companyId: companyId,
            status: true,
          },
          select: {
            id: true,
            quantity: true,
            userId: true,
            companyId: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            productId: true,
            company: {
              name: true,
            },
            product: {
              productName: true,
              productCode: true,
              brand: {
                id: true,
                brandName: true,
              },
              category: {
                id: true,
                categoryName: true,
              },
              unit: {
                id: true,
                unitName: true,
              },
            },
          },
          relations: [
            'product',
            'company',
            'product.brand',
            'product.category',
            'product.unit',
          ],
          order: {
            id: 'DESC',
          },
          skip,
          take: limit,
        },
      );
      if (inventoryData.length > 0) {
        return {
          data: inventoryData,
          total,
          page,
          limit,
        };
      } else throw new EntityNotFoundException();
    } catch (error) {
      throw error;
    }
  }

  async findEntireInventory(companyId: number) {
    try {
      const inventoryData = await this.entityManager.find(InventoryEntity, {
        where: {
          companyId: companyId,
          status: true,
        },
        select: {
          id: true,
          quantity: true,
          userId: true,
          companyId: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          productId: true,
          company: {
            name: true,
          },
          product: {
            productName: true,
            productCode: true,
            brand: {
              id: true,
              brandName: true,
            },
            category: {
              id: true,
              categoryName: true,
            },
            unit: {
              id: true,
              unitName: true,
            },
          },
        },
        relations: [
          'product',
          'company',
          'product.brand',
          'product.category',
          'product.unit',
        ],
        order: {
          id: 'DESC',
        },
      });
      if (inventoryData.length > 0) {
        return inventoryData;
      } else throw new EntityNotFoundException();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    const inventoryData = await this.entityManager.findOne(InventoryEntity, {
      where: {
        id: id,
        status: true,
      },
      select: {
        id: true,
        quantity: true,
        userId: true,
        companyId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        productId: true,
        // user: {
        //   firstName: true,
        //   lastName: true,
        // },
        company: {
          name: true,
        },
      },
      relations: ['product', 'company'],
    });
    if (!inventoryData) throw new NotFoundException('Inventory not found');
    return inventoryData;
  }
}
