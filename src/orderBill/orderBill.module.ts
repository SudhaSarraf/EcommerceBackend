import { Module } from '@nestjs/common';
import { BillService } from './orderBill.service';
import { BillController } from './orderBill.controller';

@Module({
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
