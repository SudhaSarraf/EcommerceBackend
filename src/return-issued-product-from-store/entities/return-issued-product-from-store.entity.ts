import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { ProductIssueReturnDetail } from './product-issue-return-detail.entity';

@Entity()
export class ProductIssueReturn {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: string;

    @Column()
    miti: string;

    @Column()
    returnedByUser: string;

    @Column()
    returnedByDepartmentId: number;

    @Column()
    enteredBy: string;

    @Column()
    note: string;

    @OneToMany(() => ProductIssueReturnDetail, detail => detail.productIssueReturn)
    productIssueReturnDetails: ProductIssueReturnDetail[];
}