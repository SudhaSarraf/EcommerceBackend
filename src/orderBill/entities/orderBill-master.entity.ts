import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BillDetailEntity } from './orderBill-detail.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export enum PaymentOption {
  cash = 'Cash',
  online = 'Online',
  cheque = 'Cheque',
  pickup = 'Pickup',
}

export enum OrderStatus {
  // inProcess = 'In Process',
  // completed = 'Completed',
  pending = 'Pending',
  placed = 'Placed',
  delivered = 'Delivered',
}

export enum PaymentStatus {
  // fullPayment = 'Full Payment',
  // advancePayment = 'Advance Payment',
  noPayment = 'No Payment',
  paid = 'Paid',
}

@Entity({ name: 'bill_master', schema: 'public' })
export class BillMasterEntity extends AbstractEntity<BillMasterEntity> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  billNo: number;

  @Column({ type: 'varchar', nullable: false })
  voucherNo: string;

  @Column({ type: 'date', nullable: false })
  orderDate: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: false })
  vat: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: false })
  vatAmt: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: false })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: false })
  discount: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: false })
  discountAmt: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: false })
  grandTotal: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: false })
  paid: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: false })
  due: number;

  @Column({
    name: 'accountType',
    type: 'enum',
    enum: PaymentOption,
    default: PaymentOption.cash,
  })
  paymentType: PaymentOption;

  @Column({
    name: 'PaymentStatus',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.noPayment,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'boolean', default: true, nullable: false })
  status: boolean;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.pending })
  orderStatus: OrderStatus;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  file: string;

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

  @Column({ type: 'varchar', unique: true, nullable: false })
  barCode: string;

  @OneToMany(() => BillDetailEntity, (detail) => detail.billMaster, {
    cascade: true,
  })
  billDetails: BillDetailEntity[];

  @ManyToOne(() => UserEntity, (user) => user.bills, {
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
