import { IsArray, IsDateString, IsNumber, IsString } from "class-validator"

export class CreateProductPurchaseEntryReturnDto {
    masterId: number

    billNo: number

    voucherNo: string

    @IsDateString()
    date: Date

    @IsString()
    miti: string

    @IsString()
    partyName: string

    @IsString()
    address: string

    @IsString()
    refBill: string

    @IsString()
    puchaseOrderNo: string

    @IsString()
    PO_refBill: string

    @IsNumber()
    total: number

    @IsNumber()
    discPc: number

    @IsNumber()
    discAmt: number

    @IsNumber()
    subTotal: number

    @IsNumber()
    tax: number

    @IsNumber()
    taxAmount: number

    @IsNumber()
    netTotal: number

    @IsString()
    inWords: string

    @IsString()
    transectionOn: string

    PO_status: boolean

    fiscalYear: string;

    companyId: number;


    @IsString()
    enteredBy: string

    // fiscalYear:string

    note:string

    @IsArray()
    purchaseEntryReturnDetails: purchaseEntryReturnDetails[]

}

export class purchaseEntryReturnDetails {
    @IsNumber()
    masterId: number

    @IsNumber()
    billId: number

    @IsString()
    voucherNo: string

    @IsNumber()
    productId: number

    @IsNumber()
    categoryId: number

    @IsNumber()
    quantity: number

    @IsNumber()
    brandId: number

    @IsNumber()
    unitId: number

    @IsNumber()
    pricePerUnit: number

    @IsNumber()
    totalPrice: number

    createdDate: string

    updatedDate: string

    status: boolean

    updatedTimes: number

    activeData: boolean

    // fiscalYear:string
}

export class UpdateProductPurchaseEntryReturnDto {
    @IsNumber()
    id:number

    @IsDateString()
    date: Date

    @IsString()
    miti: string

    @IsString()
    partyName: string

    @IsString()
    address: string

    @IsString()
    refBill: string

    @IsString()
    puchaseOrderNo: string

    @IsString()
    PO_refBill: string

    @IsNumber()
    total: number

    @IsNumber()
    discPc: number

    @IsNumber()
    discAmt: number

    @IsNumber()
    subTotal: number

    @IsNumber()
    tax: number

    @IsNumber()
    taxAmount: number

    @IsNumber()
    netTotal: number

    @IsString()
    inWords: string

    @IsString()
    transectionOn: string

    PO_status: boolean

    @IsString()
    enteredBy: string

    @IsNumber()
    updatedTimes: number

    fiscalYear: string;

    @IsArray()
    purchaseEntryReturnDetails: purchaseEntryReturnDetails[]
}
