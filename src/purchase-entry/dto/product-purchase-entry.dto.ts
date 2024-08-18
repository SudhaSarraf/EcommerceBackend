import { IsArray, IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateProductPurchaseEntryDto {
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


    @IsString()
    enteredBy: string

    // fiscalYear: string

    companyId: number;

    @IsArray()
    purchaseEntryDetails: CreateProductEntryDetailsDto[]
}

export class CreateProductEntryDetailsDto {

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

    // fiscalYear: string
}

export class UpdateProductPurchaseEntryDto {
    // @IsOptional()
    // @IsNumber()
    // id: number

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

    @IsArray()
    purchaseEntryDetails: CreateProductEntryDetailsDto[]
}

export class GetPurchaseEntryDto {

    id: number

    billNo: number

    voucherNo: string

    date: string

    miti: string

    partyName: string

    address: string

    refBill: string

    puchaseOrderNo: string

    PO_refBill: string

    transectionOn: string

    PO_status: boolean

    enteredBy: string

    fiscalYear: string
}