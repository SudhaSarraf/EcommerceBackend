import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BillMasterEntity } from './orderBill-master.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { OrderMain } from 'src/order-main/entities/order-main.entity';

@Entity({ name: 'bill_detail', schema: 'public' })
export class BillDetailEntity extends AbstractEntity<BillDetailEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  //foregin key of bill master
  @Column({ type: 'int', nullable: false })
  billId: number;

  @Column({ type: 'int', nullable: false })
  billNo: number;

  @Column({ type: 'varchar', length: 20 })
  voucherNo: string;

  //foregin key of order
  //  @Column({ type: 'int', nullable: false })
  //  orderId: number;

  @Column('decimal', { precision: 10, scale: 4 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 4 })
  rate: number;

  @Column('decimal', { precision: 10, scale: 4 })
  total: number;

  @Column({ type: 'boolean', nullable: false, default: true })
  status: boolean;

  @Column({ type: 'datetime', nullable: false })
  createdDate: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedDate: Date;

  @Column({ type: 'int', nullable: false })
  updatedTimes: number;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  fiscalYear: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isCancelled: boolean;

  @ManyToOne(() => BillMasterEntity, (billMaster) => billMaster.billDetails)
  @JoinColumn({ name: 'billMasterId' })
  billMaster: BillMasterEntity;

  // @OneToMany(() => OrderMain, order => order.billDetails)
  // @JoinColumn({ name: 'orderId' })
  // orders: OrderMain;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;
}
