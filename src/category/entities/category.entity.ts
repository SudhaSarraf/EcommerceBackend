import { AbstractEntity } from 'src/common/abstract.entity';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { SalesEntryDetailEntity } from 'src/sales-entry/entities/sales-entry-details.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PurchaseEntryDetailEntity } from 'src/purchase-entry/entities/productPurchaseEntryDetails.entity';
import { PurchaseReturnEntryDetailsEntity } from 'src/return-purchase-entry/entities/purchaseReturnEntryDetails.entity';

@Entity({ name: 'category', schema: 'Public' })
export class CategoryEntity extends AbstractEntity<CategoryEntity> {
  // @PrimaryGeneratedColumn('uuid')
  // id: number;

  @Column({ unique: true })
  categoryName: string;

  @Column()
  status: boolean;

  @Column()
  operatedBy?: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  //temporarely nullable is set true it will be false

  @Column({ type: 'int', nullable: true })
  userId: number;

  @Column({ type: 'int', nullable: true })
  companyId: number;

  @OneToMany(() => ProductEntity, (products) => products.category)
  products: ProductEntity[];

  @ManyToOne(() => UserEntity, (user) => user.category)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => PurchaseEntryDetailEntity, (detail) => detail.category)
  purchaseDetails: PurchaseEntryDetailEntity[];

  @OneToMany(() => PurchaseReturnEntryDetailsEntity, (returnDetail) => returnDetail.category)
  returnPurchaseDetails: PurchaseReturnEntryDetailsEntity[];

  @OneToMany(() => SalesEntryDetailEntity, (detail) => detail.category)
  salesDetails: SalesEntryDetailEntity[];

  @ManyToOne(() => CompanyInfoEntity, (company) => company.category)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;
}
