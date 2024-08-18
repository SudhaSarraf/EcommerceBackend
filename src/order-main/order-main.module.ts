import { Module } from '@nestjs/common';
import { OrderMainService } from './order-main.service';
import { OrderMainController } from './order-main.controller';

@Module({
  controllers: [OrderMainController],
  providers: [OrderMainService],
})
export class OrderMainModule {}
