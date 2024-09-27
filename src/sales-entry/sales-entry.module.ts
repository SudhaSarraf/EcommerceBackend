import { Module } from '@nestjs/common';
import { SalesEntryController } from './sales-entry.controller';
import { SalesEntryService } from './sales-entry.service';

@Module({
  controllers: [SalesEntryController],
  providers: [SalesEntryService],
})
export class IssuedProductFromStoreModule {}
