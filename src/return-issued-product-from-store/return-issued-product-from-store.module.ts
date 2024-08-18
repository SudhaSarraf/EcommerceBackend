import { Module } from '@nestjs/common';
import { ReturnIssuedProductFromStoreService } from './return-issued-product-from-store.service';
import { ReturnIssuedProductFromStoreController } from './return-issued-product-from-store.controller';

@Module({
  controllers: [ReturnIssuedProductFromStoreController],
  providers: [ReturnIssuedProductFromStoreService],
})
export class ReturnIssuedProductFromStoreModule {}
