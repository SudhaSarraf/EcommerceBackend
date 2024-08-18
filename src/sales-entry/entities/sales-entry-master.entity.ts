import { Entity, Column, ManyToOne, OneToMany, JoinColumn, } from 'typeorm';
import { SalesEntryDetailEntity } from './sales-entry-details.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { AbstractEntity } from 'src/common/abstract.entity';

export enum PaymentOption {
  cod = 'COD',
  wallet = 'Wallet',
  card = 'Card',
  netBanking = 'Net_Banking'
}

export enum OrderStatus {
  placed = 'Placed',
  accepted = 'Accepted',
  onTheWay = 'On_The_Way',
  reached = 'reached',
  outForDelivery = 'Out_For_Delivery',
  delivered = 'Delivered'
}

@Entity('sales_entry_master')
export class SalesEntryMasterEntity extends AbstractEntity<SalesEntryMasterEntity> {

  @Column({ type: 'int', nullable: false })
  userId: number

  @Column({ type: 'int', nullable: false })
  billNo: number;

  @Column({ type: 'varchar', nullable: false })
  voucherNo: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 50 })
  miti: string;

  @Column({ type: 'text' })
  billingAddress: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ type: 'int', nullable: false })
  companyId: number;

  @Column({ type: 'int', nullable: true })
  placedBy: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discPc: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discAmt: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  tax: number;

  @Column('decimal', { precision: 10, scale: 2 })
  taxAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  netTotal: number;

  @Column()
  inWords: string;

  @Column({ name: 'paymentOption', type: 'enum', enum: PaymentOption, default: PaymentOption.cod })
  paymentOption: PaymentOption;

  @Column({ name: 'orderStatus', type: 'enum', enum: OrderStatus, default: OrderStatus.placed })
  orderStatus: OrderStatus;

  @Column({ type: 'int', nullable: true })
  updatedTimes: number | null;

  @Column({ type: 'varchar', length: 10, nullable: false })
  fiscalYear: string;

  @OneToMany(() => SalesEntryDetailEntity, (detail) => detail.salesEntry, { cascade: true, })
  salesDetails: SalesEntryDetailEntity[];

  @ManyToOne(() => UserEntity, (user) => user.salesEntry)
  @JoinColumn({ name: 'customerId' })
  issuedBy: UserEntity;

  @ManyToOne(() => CompanyInfoEntity, (company) => company.salesEntry)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;

  @ManyToOne(() => UserEntity, (user) => user.salesplacedBy)
  @JoinColumn({ name: 'placedBy' })
  salesplaced: UserEntity;
}
