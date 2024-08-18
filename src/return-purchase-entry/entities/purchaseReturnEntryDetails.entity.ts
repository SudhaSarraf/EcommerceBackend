import { PurchaseEntryMasterEntity } from 'src/purchase-entry/entities/productPurchaseEntryMaster.entity';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseReturnEntryMasterEntity } from './purchaseReturnEntryMaster.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { BrandEntity } from 'src/brand/entities/brand.entity';
import { UnitEntity } from 'src/unit/entities/unit.entity';

@Entity({name:'purchase_return_entry_details', schema:'public'})
@Index('idx_categoryID', ['categoryId'])
@Index('idx_masterId', ['masterId'])
@Index('idx_productId', ['productId'])
@Index('idx_unitId', ['unitId'])
export class PurchaseReturnEntryDetailsEntity extends AbstractEntity<PurchaseReturnEntryDetailsEntity>
{
  @Column({ type: 'int' })
  masterId: number;

  @Column({ type: 'int' })
  billId: number;

  @Column({ type: 'varchar', length: 50 })
  voucherNo: string;

  @Column()
  productId: number;

  @Column()
  categoryId: number;

  @Column()
  brandId: number;

  @Column('decimal')
  quantity: number;

  @Column()
  unitId: number;

  @Column('decimal')
  pricePerUnit: number;

  @Column('decimal')
  totalPrice: number;

  @CreateDateColumn({ type: 'datetime' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedDate: Date | null;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ type: 'int' })
  updatedTimes: number;

  @Column({ type: 'boolean', nullable: true })
  activeData: boolean | null;

  // @Column({ type: 'varchar', length: 50 })
  // fiscalYear: string;

  @ManyToOne(() => ProductEntity, (product) => product.returnPurchaseDetails)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.returnPurchaseDetails)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.returnPurchaseDetails)
  @JoinColumn({ name: 'brandId' })
  brand: BrandEntity;

  @ManyToOne(() => UnitEntity, (unit) => unit.returnPurchaseDetails)
  @JoinColumn({ name: 'unitId' })
  unit: UnitEntity;
  
  @ManyToOne(() => PurchaseReturnEntryMasterEntity, purchaseReturnEntryMaster => purchaseReturnEntryMaster.purchase_return_entry_details, { onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'masterId' })
  purchase_return_entry_master: PurchaseReturnEntryMasterEntity;
}
