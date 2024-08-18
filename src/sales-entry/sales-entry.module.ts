import { Module } from '@nestjs/common';
import { IssuedProductFromStoreService } from './sales-entry.service';
import { IssuedProductFromStoreController } from './sales-entry.controller';

@Module({
  controllers: [IssuedProductFromStoreController],
  providers: [IssuedProductFromStoreService],
})
export class IssuedProductFromStoreModule {}
