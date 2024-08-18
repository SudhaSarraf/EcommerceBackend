import { AbstractEntity } from 'src/common/abstract.entity';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { PurchaseEntryDetailEntity } from 'src/purchase-entry/entities/productPurchaseEntryDetails.entity';
import { PurchaseReturnEntryDetailsEntity } from 'src/return-purchase-entry/entities/purchaseReturnEntryDetails.entity';
import { SalesEntryDetailEntity } from 'src/sales-entry/entities/sales-entry-details.entity';
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

@Entity({ name: 'brand', schema: 'Public' })
export class BrandEntity extends AbstractEntity<BrandEntity> {
  // @PrimaryGeneratedColumn('uuid')
  // id: number;

  @Column({ unique: true })
  brandName: string;

  @Column()
  status: boolean;

  @Column()
  operatedBy?: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @Column({ type: 'int', nullable: true })
  companyId: number;

  @OneToMany(() => ProductEntity, (products) => products.brand)
  products: ProductEntity[];

  @ManyToOne(() => UserEntity, (user) => user.brand)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => PurchaseEntryDetailEntity, (detail) => detail.brand)
  purchaseDetails: PurchaseEntryDetailEntity[];

  @OneToMany(() => PurchaseReturnEntryDetailsEntity, (returnDetail) => returnDetail.brand)
  returnPurchaseDetails: PurchaseEntryDetailEntity[];

  @OneToMany(() => SalesEntryDetailEntity, (detail) => detail.brand)
  salesDetails: SalesEntryDetailEntity[];

  @ManyToOne(() => CompanyInfoEntity, (company) => company.brand)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;
}
