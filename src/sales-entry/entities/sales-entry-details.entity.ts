import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { UnitEntity } from 'src/unit/entities/unit.entity';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { BrandEntity } from 'src/brand/entities/brand.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { SalesEntryMasterEntity } from './sales-entry-master.entity';

@Entity('sales_entry_details')
export class SalesEntryDetailEntity extends AbstractEntity<SalesEntryDetailEntity> {

  @Column({ type: 'int', nullable: false })
  masterId: number;

  @Column({ type: 'int', nullable: false })
  billId: number;

  @Column({ type: 'varchar', length: 50 })
  voucherNo: string;

  @Column({ type: 'int', nullable: false })
  productId: number;

  @Column({ type: 'int', nullable: false })
  categoryId: number;

  @Column({ type: 'int', nullable: false })
  brandId: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  quantity: number;

  @Column({ type: 'int', nullable: false })
  unitId: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  pricePerUnit: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  totalPrice: number;

  @CreateDateColumn({ type: 'datetime' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedDate: Date | null;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ type: 'int' })
  updatedTimes: number;

  @ManyToOne(() => ProductEntity, (product) => product.salesDetails)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.salesDetails)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.salesDetails)
  @JoinColumn({ name: 'brandId' })
  brand: BrandEntity;

  @ManyToOne(() => UnitEntity, (unit) => unit.salesDetails)
  @JoinColumn({ name: 'unitId' })
  unit: UnitEntity;

  @ManyToOne(() => CompanyInfoEntity, (company) => company.purchaseEntry)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;

  @ManyToOne(() => SalesEntryMasterEntity, salesEntryMasterEntity => salesEntryMasterEntity.salesDetails, { onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'masterId' })
  salesEntry: SalesEntryMasterEntity;
}
