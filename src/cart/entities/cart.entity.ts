import { IsString } from "class-validator";
import { AbstractEntity } from "src/common/abstract.entity";
import { CompanyInfoEntity } from "src/company-info/entities/company-info.entity";
import { ProductEntity } from "src/product/entities/product.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'cart' })
export class CartEntity extends AbstractEntity<CartEntity> {

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  quantity: number;

  @Column()
  companyId: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @IsString()
  updatedBy: string;

  @ManyToOne(() => CompanyInfoEntity, (company) => company.cart)
  @JoinColumn({ name: 'companyId' })
  company: CompanyInfoEntity;

  @ManyToOne(() => UserEntity, (user) => user.cart)
  @JoinColumn({ name: 'userId'})
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.cart)
  @JoinColumn({ name: 'productId'})
  product: ProductEntity;
}