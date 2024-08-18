import { AbstractEntity } from 'src/common/abstract.entity';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'inventory', schema: 'Public' })
export class InventoryEntity extends AbstractEntity<InventoryEntity> {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  quantity: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false })
  productId: number;

  @Column()
  userId: number;

  @Column({ nullable: false })
  companyId: number;

  @OneToOne(() => ProductEntity, (product) => product.inventory)
  @JoinColumn({ name: 'productId' })
  product?: ProductEntity[];

  @ManyToOne(() => UserEntity, (user) => user.inventory)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @ManyToOne(() => CompanyInfoEntity, (company) => company.unit)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;
}
