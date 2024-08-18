import { PaymentOption } from 'src/orderBill/entities/orderBill-master.entity';
import { AbstractEntity } from 'src/common/abstract.entity';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'order_main', schema: 'public' })
export class OrderMain extends AbstractEntity<OrderMain> {
  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @Column({ type: 'varchar', nullable: false })
  productId: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false })
  productPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false })
  productQuantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false })
  totalItems: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: false })
  discount: number;

  @Column({ type: 'text' })
  deliveryAddress: string;

  @Column({ type: 'text' })
  deliveryContact: string;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  deliveryBy: Date;

  @Column({ type: 'varchar', nullable: false })
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.orders, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => CompanyInfoEntity, (company) => company.orders)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;

  // @ManyToOne(() => BillDetailEntity, (company) => company.orders)
  // billDetails: BillDetailEntity;
}
