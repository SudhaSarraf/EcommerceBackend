import { Injectable, NotFoundException } from '@nestjs/common';
import { WishlistDto, UpdateWishlistDto } from './dto/wishlist.dto';
import { EntityManager } from 'typeorm';
import { EntityNotFoundException } from 'src/common/errors/entityNotFoundException';
import { WishlistEntity } from './entities/wishlist.entity';
import { ProductEntity } from 'src/product/entities/product.entity';

@Injectable()
export class WishlistService {
  constructor(readonly entityManager: EntityManager) {}

  async create(wishlistDto: WishlistDto) {
    console.log('Creating wishlist with DTO:', wishlistDto); // Add logging for debugging

    const { productId, ...wishlistData } = wishlistDto;
    const wishlist = this.entityManager.create(WishlistEntity, wishlistData);

    const product = await this.entityManager.findOne(ProductEntity, {
      where: {
        id: productId
      }
    });
    if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    wishlist.products = [product];

    const savedWishlist = await this.entityManager.save(WishlistEntity, wishlist);

    // Return the saved entity directly
    return savedWishlist;
}


  async findAll( companyId: number) {
    const wishlistData= await this.entityManager.find(
      WishlistEntity,
      {
        where: {
          companyId: companyId,
        },
        select: {
          id: true,
          userId: true,
          companyId: true,
          // productId: true,
          products: true,
        },
        relations: ['products'],
        order: {
          id: 'DESC',
        },
      },
    );

    if (wishlistData.length > 0) {
      return { wishlistData
      };
    } else throw new EntityNotFoundException();
  }

  async findOne(id: number) {
    try {
      const wishlistData = await this.entityManager.findOne(WishlistEntity, {
        where: {
          id: id,
        },
        select: {
          id: true,
          userId: true,
          companyId: true,
          // productId: true,
          products: true
        },
        relations: ['products']
      });
      if (!wishlistData) throw new NotFoundException('Wishlist data not found');
      return wishlistData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async findByUserId( userId: number, companyId: number) {
    const wishlistData= await this.entityManager.find(
      WishlistEntity,
      {
        where: {
          userId: userId,
          companyId: companyId,
        },
        select: {
          id: true,
          userId: true,
          companyId: true,
          // productId: true,
          products: {
            productName: true,
            productCode: true,
            productDescription: true,
            productSection: true,
            sellingPrice: true,
            offerPrice: true,
            images: true,
          },
        },
        relations: ['products'],
        order: {
          id: 'DESC',
        },
      },
    );

    if (wishlistData.length > 0) {
      return { wishlistData
      };
    } else throw new EntityNotFoundException();
  }

  async countWishlistsByProductId(productId: number): Promise<number> {
    return await this.entityManager
        .createQueryBuilder(WishlistEntity, 'wishlist')
        .innerJoin('wishlist.products', 'product')
        .where('product.id = :productId', { productId })
        .getCount();
}

  remove(id: number) {
    return this.entityManager.delete(WishlistEntity, { id: id });
  }
}
