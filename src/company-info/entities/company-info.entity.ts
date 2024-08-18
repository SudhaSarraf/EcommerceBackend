import { BrandEntity } from 'src/brand/entities/brand.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';
import { SalesEntryMasterEntity } from 'src/sales-entry/entities/sales-entry-master.entity';
import { OrderMain } from 'src/order-main/entities/order-main.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { RoleEntity } from 'src/role/entities/role.entity';
import { UnitEntity } from 'src/unit/entities/unit.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { WishlistEntity } from 'src/wishlist/entities/wishlist.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseEntryMasterEntity } from 'src/purchase-entry/entities/productPurchaseEntryMaster.entity';
import { PurchaseReturnEntryMasterEntity } from 'src/return-purchase-entry/entities/purchaseReturnEntryMaster.entity';

@Entity({ name: 'companyinfo', schema: 'public' })
export class CompanyInfoEntity extends AbstractEntity<CompanyInfoEntity> {
  // @PrimaryGeneratedColumn('uuid')
  // id: string

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'varchar', length: 500, unique: true })
  regNo: string;

  @Column({ type: 'varchar', length: 20 })
  mobile: string;

  @Column({ type: 'varchar', length: 500 })
  email: string;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 200 })
  state: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'text', nullable: true })
  websiteLink: string | null;

  @Column({ nullable: true })
  estdDate: string | null;

  @Column({ type: 'text', nullable: true })
  licenseKey: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt: Date | null;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  token: string | null;

  @Column({ type: 'text', nullable: true })
  about: string | null;

  @Column({ type: 'boolean' })
  inService: boolean;

  @Column({ type: 'varchar', nullable: true, length: 10 })
  fiscalYear: string;

  @OneToMany(() => UserEntity, (user) => user.companyId)
  users: UserEntity[];

  @OneToMany(() => ProductEntity, (products) => products.companyId)
  products: ProductEntity[];

  @OneToMany(() => RoleEntity, (role) => role.companyId)
  roles: RoleEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.company)
  category: CategoryEntity[];

  @OneToMany(() => BrandEntity, (brand) => brand.company)
  brand: BrandEntity[];

  @OneToMany(() => UnitEntity, (unit) => unit.company)
  unit: UnitEntity[];

  @OneToMany(() => InventoryEntity, (inventory) => inventory.company)
  inventory: InventoryEntity[];

  @OneToMany(() => CartEntity, (cart) => cart.company)
  cart: CartEntity[];

  @OneToMany(() => OrderMain, (orders) => orders.company)
  orders: OrderMain[];

  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.company)
  wishlist: WishlistEntity[];

  @OneToMany(() => PurchaseEntryMasterEntity, (purchaseEntry) => purchaseEntry.company,)
  purchaseEntry: PurchaseEntryMasterEntity[];

  @OneToMany(() => PurchaseReturnEntryMasterEntity, (returnpurchaseEntry) => returnpurchaseEntry.company,)
  returnPurchaseEntry: PurchaseReturnEntryMasterEntity[];

  @OneToMany(() => SalesEntryMasterEntity, (purchaseIssue) => purchaseIssue.company)
  salesEntry: SalesEntryMasterEntity[];
}
