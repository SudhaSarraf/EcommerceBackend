import { Module } from '@nestjs/common';
import { ReturnPurchaseEntryController } from './product-purchase-entry-return.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseReturnEntryMasterEntity } from './entities/purchaseReturnEntryMaster.entity';
import { PurchaseReturnEntryDetailsEntity } from './entities/purchaseReturnEntryDetails.entity';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';
import { ProductPurchaseEntryReturnService } from './product-purchase-entry-return.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseReturnEntryMasterEntity, PurchaseReturnEntryDetailsEntity, InventoryEntity])],
  controllers: [ReturnPurchaseEntryController],
  providers: [ProductPurchaseEntryReturnService],
})
export class ReturnPurchaseEntryModule {}
