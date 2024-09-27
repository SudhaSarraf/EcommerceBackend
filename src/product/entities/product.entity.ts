import { CategoryEntity } from 'src/category/entities/category.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { BrandEntity } from 'src/brand/entities/brand.entity';
import { UnitEntity } from 'src/unit/entities/unit.entity';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { WishlistEntity } from 'src/wishlist/entities/wishlist.entity';
import { SalesEntryDetailEntity } from 'src/sales-entry/entities/sales-entry-details.entity';
import { PurchaseEntryDetailEntity } from 'src/purchase-entry/entities/productPurchaseEntryDetails.entity';
import { PurchaseReturnEntryDetailsEntity } from 'src/return-purchase-entry/entities/purchaseReturnEntryDetails.entity';

export enum ProductSection {
  mens = 'men',
  womwns = 'womens',
  kids = 'kids',
}

@Entity({ name: 'product', schema: 'Public' })
export class ProductEntity extends AbstractEntity<ProductEntity> {
  @Column({ unique: true, nullable: false })
  productCode: string;

  @Column({ unique: true, nullable: false })
  barcode: string;

  @Column()
  productName: string;

  @Column({ nullable: true, type: 'text' })
  productDescription: string;

  @Column('decimal', {nullable: true, precision: 10, scale: 2 })
  purchasePrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  sellingPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  offerPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discountPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discountPercentage: number;

  @Column({ type: 'date', nullable: true })
  offerFrom: Date;

  @Column({ type: 'date', nullable: true })
  offerUpto: Date;

  @Column({ nullable: true })
  manfDate: Date;

  @Column({ nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  validityMonth: Date;

  @Column({ type: 'text', default: null, nullable: true })
  images: string;

  @Column({
    name: 'productSection',
    type: 'enum',
    enum: ProductSection,
  })
  productSection: ProductSection;

  @Column({ type: 'int', nullable: false })
  companyId: number;

  @Column({ type: 'int', nullable: false })
  categoryId: number;

  @Column({ type: 'int', nullable: true })
  brandId: number;

  @Column({ type: 'int', nullable: true })
  unitId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  status: boolean;

  @Column({ type: 'int' })
  creatorId: number;

  @Column({ length: 50, default: 'unknown' })
  createdBy: string;

  @Column({ length: 50, default: null, nullable: true })
  updatedBy: string;

  @ManyToOne(() => UserEntity, (user) => user.product)
  @JoinColumn({ name: 'creatorId' })
  user: UserEntity;

  @ManyToOne(() => CompanyInfoEntity, (company) => company.products)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  @JoinColumn({ name: 'brandId' })
  brand: BrandEntity;

  @ManyToOne(() => UnitEntity, (unit) => unit.products)
  @JoinColumn({ name: 'unitId' })
  unit: UnitEntity;

  @OneToOne(() => InventoryEntity, (inventory) => inventory.product)
  inventory: InventoryEntity;

  @OneToMany(() => CartEntity, (cart) => cart.product)
  cart: CartEntity;

  @ManyToMany(() => WishlistEntity, (wishlist) => wishlist.products)
  wishlists: WishlistEntity[];

  @OneToMany(() => PurchaseEntryDetailEntity, (detail) => detail.product)
  purchaseDetails: PurchaseEntryDetailEntity[];

  @OneToMany(() => PurchaseReturnEntryDetailsEntity, (returnDetail) => returnDetail.product)
  returnPurchaseDetails: PurchaseReturnEntryDetailsEntity[];

  @OneToMany(() => SalesEntryDetailEntity, (detail) => detail.product)
  salesDetails: SalesEntryDetailEntity[];
}
