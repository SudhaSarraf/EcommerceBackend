import { AbstractEntity } from "src/common/abstract.entity";
import { CompanyInfoEntity } from "src/company-info/entities/company-info.entity";
import { ProductEntity } from "src/product/entities/product.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, UpdateDateColumn } from "typeorm";

@Entity({ name: 'wishlist', schema: 'public' })
export class WishlistEntity extends AbstractEntity<WishlistEntity>{

    @Column()
    companyId: number;

    // @Column()
    // productId: number;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToMany(() => ProductEntity, (product) => product.wishlists, { eager: true })
    @JoinTable()
    products: ProductEntity[];

    @ManyToOne(() => UserEntity, (user) => user.wishlist)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne(() => CompanyInfoEntity, (company) => company.wishlist)
    @JoinColumn({ name: 'companyId' })
    company: CompanyInfoEntity;
}
