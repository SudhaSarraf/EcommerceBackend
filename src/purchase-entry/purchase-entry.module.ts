import { Module } from '@nestjs/common';
import { PurchaseEntryService } from './purchase-entry.service';
import { PurchaseEntryController } from './purchase-entry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntryMasterEntity } from './entities/productPurchaseEntryMaster.entity';
import { PurchaseEntryDetailEntity } from './entities/productPurchaseEntryDetails.entity';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseEntryMasterEntity, PurchaseEntryDetailEntity, InventoryEntity])],
  controllers: [PurchaseEntryController],
  providers: [PurchaseEntryService],
  exports: [PurchaseEntryService]
})
export class PurchaseEntryModule {}
