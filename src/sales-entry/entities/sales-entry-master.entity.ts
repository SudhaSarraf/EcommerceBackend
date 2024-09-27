import { Entity, Column, ManyToOne, OneToMany, JoinColumn, UpdateDateColumn, } from 'typeorm';
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
  reached = 'Reached',
  outForDelivery = 'Out_For_Delivery',
  delivered = 'Delivered',
  cancelled = 'Cancelled'
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
  placedBy: number;

  @Column({ type: 'int', nullable: true })
  acceptedBy: number;

  @Column({ type: 'int', nullable: true })
  onTheWayBy: number;

  @Column({ type: 'int', nullable: true })
  reachedBy: number;

  @Column({ type: 'int', nullable: true })
  outForDeliveryBy: number;

  @Column({ type: 'int', nullable: true })
  deliveredBy: number;

  @Column({ type: 'datetime' })
  issuedOnDate?: Date;

  @Column({ type: 'datetime' })
  acceptedByUserOnDate?: Date;

  @Column({ type: 'datetime' })
  onTheWayByUserOnDate?: Date;

  @Column({ type: 'datetime' })
  reachedByUserOnDate?: Date;

  @Column({ type: 'datetime' })
  outForDeliveryByUserOnDate?: Date;

  @Column({ type: 'datetime' })
  deliveredByUserOnDate?: Date;


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
  @JoinColumn({ name: 'userId' })
  issuedBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.acceptedBysalesEntry)
  @JoinColumn({ name: 'acceptedBy' })
  acceptedByUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.onTheWayBysalesEntry)
  @JoinColumn({ name: 'onTheWayBy' })
  onTheWayByUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.reachedBysalesEntry)
  @JoinColumn({ name: 'reachedBy' })
  reachedByUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.outForDeliveryBysalesEntry)
  @JoinColumn({ name: 'outForDeliveryBy' })
  outForDeliveryByUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.deliveredBysalesEntry)
  @JoinColumn({ name: 'deliveredBy' })
  deliveredByUser: UserEntity;

  @ManyToOne(() => CompanyInfoEntity, (company) => company.salesEntry)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;

  @ManyToOne(() => UserEntity, (user) => user.salesplacedBy)
  @JoinColumn({ name: 'placedBy' })
  salesplaced: UserEntity;
}
