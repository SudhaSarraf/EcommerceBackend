import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PurchaseReturnEntryDetailsEntity } from './purchaseReturnEntryDetails.entity';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { AbstractEntity } from 'src/common/abstract.entity';

@Entity({name:'purchase_return_entry_master', schema:'public'})
export class PurchaseReturnEntryMasterEntity extends AbstractEntity<PurchaseReturnEntryMasterEntity>{
    @Column({ type: 'int' })
    billNo: number;
  
    @Column({ type: 'varchar', length: 10 })
    voucherNo: string;
  
    @Column({ type: 'datetime' })
    date: Date;

    @Column()
    miti: string;

    @Column()
    partyName: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    refBill: string;

    @Column({ nullable: true })
    purchaseOrderNo: string;

    @Column({ nullable: true })
    PO_refBill: string;

    @Column('decimal')
    total: number;

    @Column('decimal')
    discPc: number;

    @Column('decimal')
    discAmt: number;

    @Column('decimal')
    subTotal: number;

    @Column('decimal')
    tax: number;

    @Column('decimal')
    taxAmount: number;

    @Column('decimal')
    netTotal: number;

    @Column()
    inWords: string;

    @Column()
    transectionOn: string;

    @Column({ nullable: true })
    PO_status: boolean;

    @Column({ type: 'int', nullable: true })
    updatedTimes: number | null;

    companyId: number;

    @Column()
    enteredBy: string;

    @Column()
    note: string;

    isActive: boolean;

    @CreateDateColumn({ type: 'datetime' })
    createdDate: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    updatedBy: string | null;

    @UpdateDateColumn({ type: 'datetime', nullable: true })
    updatedDate: Date | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    fiscalYear:string

    @OneToMany(() => PurchaseReturnEntryDetailsEntity, purchaseReturnEntryDetails => purchaseReturnEntryDetails.purchase_return_entry_master)
    purchase_return_entry_details: PurchaseReturnEntryDetailsEntity[];

    @ManyToOne(() => CompanyInfoEntity, (company) => company.returnPurchaseEntry)
    @JoinColumn({ name: 'companyId' })
    company: CompanyInfoEntity;
}