import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto, UpdateCartDto } from './dto/cart.dto';
import { EntityManager, In } from 'typeorm';
import { CartEntity } from './entities/cart.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { EntityNotFoundException } from 'src/common/errors/entityNotFoundException';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';

@Injectable()
export class CartService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createCartDto: CreateCartDto) {
    try {
      return await this.entityManager.transaction(async (eManager) => {
        // Check if the user exists
        const user = await eManager.findOne(UserEntity, {
          where: { userId: createCartDto.userId },
        });
        if (!user)
          throw new HttpException(
            'User record not found in the database.',
            400,
          );

        // Initialize an array to hold cart items
        const cartItems: CartEntity[] = [];

        // Process each product in the cart
        for (const productDto of createCartDto.products) {
          // Check if the product exists
          const product = await eManager.findOne(ProductEntity, {
            where: { id: productDto.productId },
          });
          if (!product)
            throw new HttpException(
              `Product with id ${productDto.productId} not found in the database`,
              400,
            );

          // Check the inventory for the product quantity
          const inventory = await eManager.findOne(InventoryEntity, {
            where: { productId: productDto.productId },
          });
          if (!inventory)
            throw new HttpException(
              `Inventory record for product with id ${productDto.productId} not found in the database`,
              400,
            );
          if (inventory.quantity < productDto.quantity) {
            throw new HttpException(
              `Insufficient quantity for product with id ${productDto.productId} in the inventory`,
              400,
            );
          }

          // Create and add the cart entity to the list
          const cartEntity = new CartEntity(createCartDto);
          cartEntity.quantity = productDto.quantity;
          cartEntity.companyId = createCartDto.companyId;
          cartEntity.userId = createCartDto.userId;
          cartEntity.productId = productDto.productId;
          cartItems.push(cartEntity);
        }

        // Save all cart items
        const result = await eManager.save(cartItems);

        // Return only relevant fields for each cart item
        return result.map((cartItem) => ({
          id: cartItem.id,
          userId: cartItem.userId,
          companyId: cartItem.companyId,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          createdAt: cartItem.createdAt,
          updatedAt: cartItem.updatedAt,
        }));
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    const cartData = await this.entityManager.findOne(CartEntity, {
      where: {
        id: id,
      },
      select: {
        id: true,
        quantity: true,
        companyId: true,
        userId: true,
        productId: true,
        createdAt: true,
        updatedAt: true,
        product: {
          productName: true,
          sellingPrice: true,
          offerPrice: true,
          images: true
        }
      },
      relations: ['user', 'product'],
    });
    if (!cartData) throw new NotFoundException('Cart data not found.');
    return cartData;
  }

  async findByUserId(userId: number, companyId: number) {
    const cartData = await this.entityManager.find(CartEntity, {
      where: {
        userId: userId,
        companyId: companyId,
      },
      select: {
        id: true,
        quantity: true,
        companyId: true,
        userId: true,
        productId: true,
        createdAt: true,
        updatedAt: true,
        product: {
          productName: true,
          sellingPrice: true,
          offerPrice: true,
          images: true
        },
      },
      relations: ['product'],
      order: {
        id: 'DESC',
      },
    });

    if (cartData.length > 0) {
      return cartData;
    } else throw new EntityNotFoundException();
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    try {
      return await this.entityManager.transaction(async (eManager) => {
        // Check if the cart exists
        const cart = await eManager.findOne(CartEntity, {
          where: { id },
        });
        if (!cart)
          throw new HttpException(
            'Cart record not found in the database.',
            400,
          );

        // Check if the user exists
        const user = await eManager.findOne(UserEntity, {
          where: { userId: updateCartDto.userId },
        });
        if (!user)
          throw new HttpException(
            'User record not found in the database.',
            400,
          );

        // Initialize an array to hold cart items
        const cartItems: CartEntity[] = [];

        // Process each product in the cart
        for (const productDto of updateCartDto.products) {
          // Check if the product exists
          const product = await eManager.findOne(ProductEntity, {
            where: { id: productDto.productId },
          });
          if (!product)
            throw new HttpException(
              `Product with id ${productDto.productId} not found in the database`,
              400,
            );

          // Check the inventory for the product quantity
          const inventory = await eManager.findOne(InventoryEntity, {
            where: { productId: productDto.productId },
          });
          if (!inventory)
            throw new HttpException(
              `Inventory record for product with id ${productDto.productId} not found in the database`,
              400,
            );
          if (inventory.quantity < productDto.quantity) {
            throw new HttpException(
              `Insufficient quantity for product with id ${productDto.productId} in the inventory`,
              400,
            );
          }

          // Update the cart entity
          cart.quantity = productDto.quantity;
          cart.companyId = updateCartDto.companyId;
          cart.userId = updateCartDto.userId;
          cart.productId = productDto.productId;
          cartItems.push(cart);
        }

        // Save the updated cart items
        const result = await eManager.save(cartItems);

        // Return only relevant fields for each cart item
        return result.map((cartItem) => ({
          id: cartItem.id,
          userId: cartItem.userId,
          companyId: cartItem.companyId,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          createdAt: cartItem.createdAt,
          updatedAt: cartItem.updatedAt,
          updatedBy: user.firstName + ' ' + user.lastName,
        }));
      });
    } catch (error) {
      throw error;
    }
  }

  async checkQuantity(ids: any) {
    try {
      return await this.entityManager.transaction(async (eManager) => {
        console.log('ids', ids.pids);
        const a = ids.pids;
        //get all active products in the inventory
        const allActiveProduct = await eManager.find(InventoryEntity, {
          where: {
            id: In[a],
            status: true,
          },
          select: {
            id: true,
            quantity: true,
          },
        });
        console.log('All active product', allActiveProduct);

        return allActiveProduct;
      });
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return this.entityManager.delete(CartEntity, { id: id });
  }

  async removeAll(ids: number[]) {
    return this.entityManager.delete(CartEntity, { id: In(ids) });
  }
}
