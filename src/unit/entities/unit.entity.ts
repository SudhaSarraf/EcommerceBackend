import { AbstractEntity } from 'src/common/abstract.entity';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { PurchaseEntryDetailEntity } from 'src/purchase-entry/entities/productPurchaseEntryDetails.entity';
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

@Entity({ name: 'unit', schema: 'Public' })
export class UnitEntity extends AbstractEntity<UnitEntity> {
  // @PrimaryGeneratedColumn('uuid')
  // id: number;

  @Column({ unique: true })
  unitName: string;

  @Column({ default: true })
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

  @OneToMany(() => ProductEntity, (products) => products.unit)
  products: ProductEntity[];

  @ManyToOne(() => UserEntity, (user) => user.unit)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => PurchaseEntryDetailEntity, (detail) => detail.unit)
  purchaseDetails: PurchaseEntryDetailEntity[];

  @OneToMany(() => PurchaseEntryDetailEntity, (returnDetail) => returnDetail.unit)
  returnPurchaseDetails: PurchaseEntryDetailEntity[];

  @OneToMany(() => SalesEntryDetailEntity, (detail) => detail.unit)
  salesDetails: SalesEntryDetailEntity[];

  @ManyToOne(() => CompanyInfoEntity, (company) => company.unit)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;
}
