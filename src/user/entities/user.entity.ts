import { BillMasterEntity } from 'src/orderBill/entities/orderBill-master.entity';
import { BrandEntity } from 'src/brand/entities/brand.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { AbstractWithNoId } from 'src/common/abstractWithNoId';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';
import { OrderMain } from 'src/order-main/entities/order-main.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { RoleEntity } from 'src/role/entities/role.entity';
import { UnitEntity } from 'src/unit/entities/unit.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { WishlistEntity } from 'src/wishlist/entities/wishlist.entity';
import { SalesEntryMasterEntity } from 'src/sales-entry/entities/sales-entry-master.entity';

@Entity('users')
export class UserEntity extends AbstractWithNoId<UserEntity> {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone?: string;

  @Column({ type: 'text', nullable: true, default: null })
  houseNoAreaStreet?: string;

  @Column({ type: 'text', nullable: true, default: null })
  landmark?: string;

  @Column({ type: 'text', nullable: true, default: null })
  state?: string;

  @Column({ type: 'text', nullable: true, default: null })
  cityTown?: string;

  @Column({ nullable: true, default: null })
  pinCode?: number;

  @Column({ default: true })
  active: boolean;

  @Column()
  companyId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @Column({ default: null, nullable: true })
  updatedBy?: string;

  @DeleteDateColumn({ default: null, nullable: true })
  deletedAt?: Date;

  @Column()
  createdBy?: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({
    nullable: false,
    default: 'N/A',
  })
  @Column()
  image?: string;

  @Column({ nullable: true, default: null, type: 'text' })
  hashedRt: string;

  @Column('int', { nullable: true, default: null })
  otp1: number;

  @Column('int', { nullable: true, default: null })
  otp2: number;

  @Column('int', { nullable: true, default: null })
  otp3: number;

  @ManyToMany(() => RoleEntity, (role) => role.users, { eager: true })
  @JoinTable()
  roles: RoleEntity[];

  @OneToMany(() => OrderMain, (order) => order.user)
  orders: OrderMain[];

  @OneToMany(() => ProductEntity, (product) => product.user)
  product: ProductEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.user)
  category: CategoryEntity[];

  @OneToMany(() => BrandEntity, (brand) => brand.user)
  brand: BrandEntity[];

  @OneToMany(() => UnitEntity, (unit) => unit.user)
  unit: UnitEntity[];

  @OneToMany(() => BillMasterEntity, (billEntity) => billEntity.user)
  bills: BillMasterEntity[];

  @OneToMany(() => CartEntity, (cart) => cart.user)
  cart: CartEntity[];

  @OneToMany(() => InventoryEntity, (inventory) => inventory.user)
  inventory: InventoryEntity;

  @ManyToOne(() => CompanyInfoEntity, (company) => company.users)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;

  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.user)
  wishlist: WishlistEntity[];

  @OneToMany(() => SalesEntryMasterEntity, (salesEntry) => salesEntry.issuedBy)
  salesEntry: SalesEntryMasterEntity[];

  @OneToMany(() => SalesEntryMasterEntity, (salesEntry) => salesEntry.acceptedByUser)
  acceptedBysalesEntry: SalesEntryMasterEntity[];

  @OneToMany(() => SalesEntryMasterEntity, (salesEntry) => salesEntry.onTheWayByUser)
  onTheWayBysalesEntry: SalesEntryMasterEntity[];

  @OneToMany(() => SalesEntryMasterEntity, (salesEntry) => salesEntry.reachedByUser)
  reachedBysalesEntry: SalesEntryMasterEntity[];

  @OneToMany(() => SalesEntryMasterEntity, (salesEntry) => salesEntry.outForDeliveryByUser)
  outForDeliveryBysalesEntry: SalesEntryMasterEntity[];

  @OneToMany(() => SalesEntryMasterEntity, (salesEntry) => salesEntry.deliveredByUser)
  deliveredBysalesEntry: SalesEntryMasterEntity[];


  @OneToMany(() => SalesEntryMasterEntity, (salesEntry) => salesEntry.salesplaced)
  salesplacedBy: SalesEntryMasterEntity[];
}
