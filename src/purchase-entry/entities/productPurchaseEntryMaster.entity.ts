import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { PurchaseEntryDetailEntity } from './productPurchaseEntryDetails.entity';

@Entity({ name: 'purchase_entry_master', schema: 'public' })
export class PurchaseEntryMasterEntity extends AbstractEntity<PurchaseEntryMasterEntity> {
  @Column({ type: 'int' })
  billNo: number;

  @Column({ type: 'varchar', length: 20 })
  voucherNo: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'varchar', length: 10 })
  miti: string;

  @Column({ type: 'varchar', length: 225 })
  partyName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  refBill: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  puchaseOrderNo: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  PO_refBill: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  discPc: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  discAmt: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  subTotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  netTotal: number;

  @Column({ type: 'varchar', length: 500 })
  inWords: string;

  @Column({ type: 'varchar', length: 20 })
  transectionOn: string;

  @Column({ type: 'boolean', nullable: true })
  PO_status: boolean | null;

  @Column({ type: 'int', nullable: false })
  companyId: number;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @Column({ type: 'varchar', length: 100 })
  enteredBy: string;

  @CreateDateColumn({ type: 'datetime' })
  createdDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  updatedBy: string | null;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedDate: Date | null;

  @Column({ type: 'int', nullable: true })
  updatedTimes: number | null;

  @OneToMany(
    () => PurchaseEntryDetailEntity,
    (purchaseEntryDetails) => purchaseEntryDetails.purchase_entry_master,
    { cascade: true },
  )
  purchase_entry_details: PurchaseEntryDetailEntity[];

  @ManyToOne(() => CompanyInfoEntity, (company) => company.purchaseEntry)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;
}
