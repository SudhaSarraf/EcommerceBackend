import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductIssueReturn } from "./return-issued-product-from-store.entity";

@Entity()
export class ProductIssueReturnDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productId: number;

    @Column()
    categoryId: number;

    @Column('decimal')
    quantity: number;

    @Column()
    untiId: number;

    @ManyToOne(() => ProductIssueReturn, issueReturn => issueReturn.productIssueReturnDetails)
    productIssueReturn: ProductIssueReturn;
}