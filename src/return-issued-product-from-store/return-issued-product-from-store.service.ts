import { Injectable } from '@nestjs/common';
import { CreateReturnIssuedProductFromStoreDto } from './dto/create-return-issued-product-from-store.dto';
import { UpdateReturnIssuedProductFromStoreDto } from './dto/update-return-issued-product-from-store.dto';

@Injectable()
export class ReturnIssuedProductFromStoreService {
  create(createReturnIssuedProductFromStoreDto: CreateReturnIssuedProductFromStoreDto) {
    return 'This action adds a new returnIssuedProductFromStore';
  }

  findAll() {
    return `This action returns all returnIssuedProductFromStore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} returnIssuedProductFromStore`;
  }

  update(id: number, updateReturnIssuedProductFromStoreDto: UpdateReturnIssuedProductFromStoreDto) {
    return `This action updates a #${id} returnIssuedProductFromStore`;
  }

  remove(id: number) {
    return `This action removes a #${id} returnIssuedProductFromStore`;
  }
}
