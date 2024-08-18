import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { UnitEntity } from 'src/unit/entities/unit.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { BrandEntity } from 'src/brand/entities/brand.entity';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { PurchaseEntryMasterEntity } from './productPurchaseEntryMaster.entity';

@Entity({ name: 'purchase_entry_detais', schema: 'public' })
@Index('idx_billId', ['billId'])
@Index('idx_productId', ['productId'])
@Index('idx_unitId', ['unitId'])
@Index('idx_masterId', ['masterId'])
export class PurchaseEntryDetailEntity extends AbstractEntity<PurchaseEntryDetailEntity> {
  @Column({ type: 'int' })
  masterId: number;

  @Column({ type: 'int' })
  billId: number;

  @Column({ type: 'varchar', length: 20 })
  voucherNo: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false })
  quantity: number;

  @Column()
  productId: number;

  @Column({ nullable: true })
  brandId?: number;

  @Column({ nullable: true })
  categoryId?: number;

  @Column({ nullable: true })
  unitId?: number;

  @Column()
  pricePerUnit: number;

  @Column()
  totalPrice: number;

  companyId: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ type: 'int' })
  updatedTimes: number;

  @Column({ type: 'boolean', nullable: true })
  activeData: boolean | null;

  @ManyToOne(() => PurchaseEntryMasterEntity,(purchaseEntryMaster) => purchaseEntryMaster.purchase_entry_details,)
  @JoinColumn({ name: 'purchaseEntryId' })
  purchase_entry_master: PurchaseEntryMasterEntity;

  @ManyToOne(() => ProductEntity, (product) => product.purchaseDetails)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.purchaseDetails)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.purchaseDetails)
  @JoinColumn({ name: 'brandId' })
  brand: BrandEntity;

  @ManyToOne(() => UnitEntity, (unit) => unit.purchaseDetails)
  @JoinColumn({ name: 'unitId' })
  unit: UnitEntity;

  // @ManyToOne(() => CompanyInfoEntity, (company) => company.purchaseEntry)
  // @JoinColumn({ name: 'companyId' })
  // company: CompanyInfoEntity;
}
