import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductIssueDto } from './dto/sales-entry.dto';
import { SalesEntryMasterEntity } from './entities/sales-entry-master.entity';
import { EntityManager } from 'typeorm';
import { SalesEntryDetailEntity } from './entities/sales-entry-details.entity';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';


@Injectable()
export class IssuedProductFromStoreService {
  constructor(private readonly entityManager: EntityManager) { }

  async create(productDto: CreateProductIssueDto) {
    return await this.entityManager.transaction(async (eManager) => {
      try {
        //let productDto = new SalesEntryMasterEntity(productDto);

        console.log({ productDto: productDto, productDtoAll: [productDto, productDto.salerData[0], productDto.salerData[1]] })

        let exsistingYear = productDto.fiscalYear

        let bill = [];
        let billWithDetails = [];

        for (let i = 0; i < productDto.salerData.length; i++) {

          let latestBillData = await eManager.find(SalesEntryMasterEntity, {
            select: {
              billNo: true,
            },
            order: {
              billNo: 'DESC',
            },
          })

          let uptoBillNo = !latestBillData[0] ? 0 : latestBillData[0].billNo;
          let latestBillNo = latestBillData.length > 0 ? latestBillData[0].billNo : (uptoBillNo ? uptoBillNo : 0)//latestBillData ? uptoBillNo || 0 : 0;
          let newBillNo = latestBillNo + 1;

          if (!newBillNo || newBillNo === 0) throw new InternalServerErrorException('Technical error at bill generation. Contact support.');

          console.log('latestBillData', latestBillData, '\n', 'newBillNo', newBillNo);

          const createdMasterData = eManager.create(SalesEntryMasterEntity, {
            userId: productDto.userId,
            billNo: newBillNo,
            voucherNo: ("Bill:- 0" + newBillNo).toString(),
            date: new Date(productDto.date),
            miti: productDto.miti,
            placedBy: null,
            billingAddress: productDto.billingAddress,
            total: productDto.salerData[i].total,
            discPc: productDto.salerData[i].discPc,
            discAmt: productDto.salerData[i].discAmt,
            subTotal: productDto.salerData[i].subTotal,
            tax: productDto.salerData[i].tax,
            taxAmount: productDto.salerData[i].taxAmount,
            netTotal: productDto.salerData[i].netTotal,
            inWords: productDto.salerData[i].inWords,
            paymentOption: productDto.salerData[i].paymentOption,
            orderStatus: productDto.salerData[i].orderStatus,
            updatedTimes: 0,
            fiscalYear: exsistingYear,
            note: productDto.note,
            companyId: productDto.companyId
          })

          console.log('productDto.salerData', productDto.salerData[i]);
          const savedMasterData = await eManager.save(SalesEntryMasterEntity, createdMasterData);

          let masterData = savedMasterData;//savedMasterData.identifiers[0].id;
          if (masterData.billNo === 0) throw new InternalServerErrorException('Technical error at bill generation. Contact support.');

          console.log(masterData)

          let billDetailsArray = [];
          let inventoryQuantityArray = [];
          let inventoryIdsToUpdate = [];

          //here length starts form 1 so we must compare loop value starting from 1 or length -1
          for (let j = 0; j <= (productDto.salerData[i].products.length - 1); i++) {

            billDetailsArray.push({
              masterId: masterData.id,
              billId: masterData.billNo,
              voucherNo: masterData.voucherNo,
              productId: productDto.salerData[i].products[j].productId,
              categoryId: productDto.salerData[i].products[j].categoryId,
              quantity: productDto.salerData[i].products[j].quantity,
              unitId: productDto.salerData[i].products[j].unitId,
              pricePerUnit: productDto.salerData[i].products[j].pricePerUnit,
              totalPrice: productDto.salerData[i].products[j].totalPrice,
              status: true,
              updatedTimes: masterData.updatedTimes
            })

            //seperating ids and quantities to alter inventory
            inventoryIdsToUpdate.push(productDto.salerData[i].products[j].productId)
            inventoryQuantityArray.push({
              quantity: productDto.salerData[i].products[j].quantity
            })

            //here new value is being inserted to details
            var detailsResult = await eManager.save(SalesEntryDetailEntity, billDetailsArray);
            if (detailsResult[j].id < 0) throw new InternalServerErrorException('Failed product details creation.');

            //#region where inventory is being updated by incrementing with purchased quantity in inventry update
            const inventoryDecrement = await Promise.all(inventoryIdsToUpdate.map(async (productId, index) => {
              await eManager.decrement(InventoryEntity, { productId: productId }, 'quantity', inventoryQuantityArray[index].quantity);
            }));
            if (inventoryDecrement.length < 0) throw new InternalServerErrorException('Failed product details creation.');
          }
          bill.push(masterData);
          billWithDetails.push(masterData, { detailsResult })
        }

        if (productDto.salerData.length === bill.length) return { bills: billWithDetails }
        else throw new InternalServerErrorException("Failed to save bill/details!!");
      }
      catch (error) {
        console.log({ error: error })
        return "Failed to create sales data!!";
      }

    });
  }

  // findAll() {
  //   return `This action returns all issuedProductFromStore`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} issuedProductFromStore`;
  // }

  // update(id: number, updateIssuedProductFromStoreDto: UpdateIssuedProductFromStoreDto) {
  //   return `This action updates a #${id} issuedProductFromStore`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} issuedProductFromStore`;
  // }
}
