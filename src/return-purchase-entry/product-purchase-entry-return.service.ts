import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityNotFoundException } from 'src/common/errors/entityNotFoundException';
import { CreateProductPurchaseEntryReturnDto, UpdateProductPurchaseEntryReturnDto } from './dto/purchase-entry-return.dto';
import { EntityManager } from 'typeorm';
import { PurchaseReturnEntryMasterEntity } from './entities/purchaseReturnEntryMaster.entity';
import { CompanyInfoEntity } from 'src/company-info/entities/company-info.entity';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';
import { PurchaseReturnEntryDetailsEntity } from './entities/purchaseReturnEntryDetails.entity';


@Injectable()
export class ProductPurchaseEntryReturnService {
  constructor(private readonly entityManager: EntityManager) { }
  async create(createProductPurchaseEntryReturnDto: CreateProductPurchaseEntryReturnDto) {
    try {
      let entryData = new PurchaseReturnEntryMasterEntity(createProductPurchaseEntryReturnDto)
      return await this.entityManager.transaction(async (eManager) => {

        let exsistingYear = await eManager.findOne(CompanyInfoEntity, {
          where: {
            fiscalYear:createProductPurchaseEntryReturnDto.fiscalYear,
            inService: true
          },
          select: {
            id: true,
            fiscalYear: true
          }
        });

        // if (exsistingYear === null) return { error: "Error getting fiscal year data. Contact support." }

        let latestBillData = await eManager.find(PurchaseReturnEntryMasterEntity, {
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

        const savedMasterData = await eManager.insert(PurchaseReturnEntryMasterEntity, {
          billNo: newBillNo,
          voucherNo: ("Bill:- 0" + newBillNo).toString(),
          date: new Date(entryData.date),
          miti: entryData.miti,
          partyName: entryData.partyName ? entryData.partyName : 'CASH A/C',
          address: entryData.address ? entryData.address : null,
          refBill: entryData.refBill ? entryData.refBill : null,
          purchaseOrderNo: null,
          PO_refBill: null,
          total: entryData.total,
          discPc: entryData.discPc,
          discAmt: entryData.discAmt,
          subTotal: entryData.subTotal,
          tax: entryData.tax,
          taxAmount: entryData.taxAmount,
          netTotal: entryData.netTotal,
          inWords: entryData.inWords,
          transectionOn: entryData.transectionOn,
          PO_status: entryData.PO_status ? entryData.PO_status : null,
          // isActive: true,
          enteredBy: entryData.enteredBy,
          updatedTimes: 0,
          fiscalYear: exsistingYear.fiscalYear,
          note: entryData.note
        });

        let masterId = savedMasterData.identifiers[0].id;

        const masterData = await eManager.findOne(PurchaseReturnEntryMasterEntity, {
          where: {
            id: masterId
          },
          select: {
            id: true,
            billNo: true,
            voucherNo: true,
            updatedTimes: true
          }
        })

        console.log('masterData', masterData);

        let billDetailsArray = [];
        let inventoryQuantityArray = [];
        let inventoryIdsToUpdate = [];

        for (let i = 0; i < createProductPurchaseEntryReturnDto.purchaseEntryReturnDetails.length; i++) {
          billDetailsArray.push({
            masterId: masterData.id,
            billId: masterData.billNo,
            voucherNo: masterData.voucherNo,
            productId: createProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].productId,
            categoryId: createProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].categoryId,
            quantity: createProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].quantity,
            unitId: createProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].unitId,
            pricePerUnit: createProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].pricePerUnit,
            totalPrice: createProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].totalPrice,
            status: true,
            updatedTimes: masterData.updatedTimes,
            activeData: true,
            fiscalYear: exsistingYear.fiscalYear
          });

          inventoryIdsToUpdate.push(createProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].productId)
          inventoryQuantityArray.push({
            quantity: createProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].quantity
          })
        }

        if (masterData.billNo === 0) throw new InternalServerErrorException('Technical error at bill generation. Contact support.');

        console.log('billDetailsArray', billDetailsArray)

        //here new value is being inserted to details
        const detailsResult = await eManager.insert(PurchaseReturnEntryDetailsEntity, billDetailsArray);
        if (detailsResult.identifiers[0].id < 0) throw new InternalServerErrorException('Failed product details creation.');


        //#region where inventory is being updated by incrementing with purchased quantity in inventry update
        const inventoryDecrement = await Promise.all(inventoryIdsToUpdate.map(async (productId, index) => {
          await eManager.decrement(InventoryEntity, { productId: productId }, 'quantity', inventoryQuantityArray[index].quantity);
        }));

        console.log('inventory', inventoryDecrement);
        //#endregion 

        if (inventoryDecrement.length === detailsResult.generatedMaps.length) return { message: 'Purchase Return entry done.' }
        else throw new InternalServerErrorException("Failed to save bill/details!!");
      });
    }
    catch (error) {
      return "Failed to create purchase return data!!";
    }
  }

  async findAll(fiscalYear: string) {
    try {
      return await this.entityManager.find(PurchaseReturnEntryMasterEntity, {
        where: {
          fiscalYear: fiscalYear
        },
        select: {
          id: true,
          billNo: true,
          voucherNo: true,
          date: true,
          miti: true,
          partyName: true,
          address: true,
          refBill: true,
          purchaseOrderNo: true,
          PO_refBill: true,
          total: true,
          discPc: true,
          discAmt: true,
          subTotal: true,
          tax: true,
          taxAmount: true,
          netTotal: true,
          inWords: true,
          transectionOn: true,
          PO_status: true,
          isActive: true,
          enteredBy: true,
          createdDate: true,
          updatedBy: true,
          updatedDate: true,
          updatedTimes: true,
          // fiscalYear: true,
          note: true
        }
      });
    } catch (error) {
      throw error
    }
  }

  async findDetailsById(id: number, billNo: number, fiscalYear: string) {
    try {
      return await this.entityManager.find(PurchaseReturnEntryDetailsEntity, {
        where: {
          masterId: Number(id),
          billId: Number(billNo),
          // fiscalYear: fiscalYear,
          status: true
        },
        select: {
          masterId: true,
          billId: true,
          voucherNo: true,
          productId: true,
          categoryId: true,
          quantity: true,
          unitId: true,
          pricePerUnit: true,
          totalPrice: true,
          createdDate: true,
          updatedDate: true,
          status: true,
          updatedTimes: true,
          activeData: true,
          // fiscalYear: true
        }
      });
    }
    catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async update(updateProductPurchaseEntryReturnDto: UpdateProductPurchaseEntryReturnDto) {
    try {

      let entryData = new PurchaseReturnEntryMasterEntity(updateProductPurchaseEntryReturnDto);
      return await this.entityManager.transaction(async eManager => {
        let exsistingYear = await eManager.findOne(CompanyInfoEntity, {
          where: {
            fiscalYear:updateProductPurchaseEntryReturnDto.fiscalYear,
            inService: true
          },
          select: {
            id: true,
            fiscalYear: true
          }
        });

        if (exsistingYear === null) return { error: "Error getting fiscal year data. Contact support." }

        console.log('exsistingYear:', exsistingYear);

        const latestUpdatedTime = (await eManager.createQueryBuilder()
          .select("updatedTimes")
          .from(PurchaseReturnEntryMasterEntity, "entity")
          .where("entity.id = :id", { id: entryData.id })
          .getRawOne()).updatedTimes + 1;

        if (!latestUpdatedTime || latestUpdatedTime < 0) throw new InternalServerErrorException('Updated Times Generation Failed.');

        const updatedRecord = await eManager.update(PurchaseReturnEntryMasterEntity, entryData.id, {
          date: new Date(entryData.date),
          miti: entryData.miti,
          partyName: entryData.partyName ? entryData.partyName : 'CASH A/C',
          address: entryData.address ? entryData.address : null,
          refBill: entryData.refBill ? entryData.refBill : null,
          purchaseOrderNo: null,
          PO_refBill: null,
          total: entryData.total,
          discPc: entryData.discPc,
          discAmt: entryData.discAmt,
          subTotal: entryData.subTotal,
          tax: entryData.tax,
          taxAmount: entryData.taxAmount,
          netTotal: entryData.netTotal,
          inWords: entryData.inWords,
          transectionOn: entryData.transectionOn,
          PO_status: entryData.PO_status ? entryData.PO_status : null,
          isActive: true,
          updatedBy: entryData.enteredBy,
          updatedDate: new Date(),
          updatedTimes: latestUpdatedTime
        });

        if (updatedRecord.affected <= 0) throw new InternalServerErrorException('Failed updating record.');

        let masterData = await eManager.findOne(PurchaseReturnEntryMasterEntity, {
          where: {
            id: entryData.id
          },
          select: {
            id: true,
            billNo: true,
            voucherNo: true,
            updatedTimes: true
          }
        });

        console.log('masterData:', masterData);

        let previouslyDecreasedQuantity = await eManager.find(PurchaseReturnEntryDetailsEntity, {
          where: {
            masterId: entryData.id,
            status: true,
            updatedTimes: entryData.updatedTimes  //this is old updated times
          },
          select: {
            masterId: true,
            billId: true,
            productId: true,
            quantity: true
          }
        });

        console.log('previouslyDecreasedQuantity:', previouslyDecreasedQuantity);

        if (previouslyDecreasedQuantity.length <= 0) throw new EntityNotFoundException('Cannot find details related to this bill.')

        //BINDING PREVIOUS PRODUCT ITEMS QUANTITY AND ID TO THE ARRAY
        let inventoryIdsToIncrease = [];
        let inventoryQuantityToIncreaseArray = [];
        for (let i = 0; i < previouslyDecreasedQuantity.length; i++) {
          inventoryIdsToIncrease.push(previouslyDecreasedQuantity[i].productId)
          inventoryQuantityToIncreaseArray.push({
            quantity: Number(previouslyDecreasedQuantity[i].quantity)
          })
        }

        console.log('inventoryIdsToIncrease:', inventoryIdsToIncrease);
        console.log('inventoryQuantityToIncreaseArray:', inventoryQuantityToIncreaseArray);


        //#region where inventory is being updated by decerementing the previously entered record by purchased quantity in inventry update
        const inventoryIncrement = await Promise.all(inventoryIdsToIncrease.map(async (productId, index) => {
          await eManager.increment(InventoryEntity, { productId: productId }, 'quantity', inventoryQuantityToIncreaseArray[index].quantity);
        }));

        console.log('inventoryDecrement:', inventoryIncrement)
        //#endregion      

        let disablePreviousItems = await eManager.update(PurchaseReturnEntryDetailsEntity, { masterId: entryData.id, updatedTimes: entryData.updatedTimes }, {
          status: false
        });

        console.log('disablePreviousItems:', disablePreviousItems);

        //BINDING NEW UPDATED DATA OF ITEM DETAILS TO ENTER TO THE TABLE AND UPDATE THE INVENTORY WITH NEW RECORD
        let billDetailsArray = [];
        let inventoryIdsToUpdate = [];
        let inventoryQuantityArray = [];
        for (let i = 0; i < updateProductPurchaseEntryReturnDto.purchaseEntryReturnDetails.length; i++) {

          billDetailsArray.push({
            masterId: masterData.id,
            billId: masterData.billNo,
            voucherNo: masterData.voucherNo,
            productId: updateProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].productId,
            categoryId: updateProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].categoryId,
            quantity: updateProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].quantity,
            unitId: updateProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].unitId,
            brandId: updateProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].brandId,
            pricePerUnit: updateProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].pricePerUnit,
            totalPrice: updateProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].totalPrice,
            status: true,
            updatedTimes: masterData.updatedTimes,
            activeData: true,
            // fiscalYear: exsistingYear.yearCode
          });

          inventoryIdsToUpdate.push(updateProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].productId)
          inventoryQuantityArray.push({
            quantity: updateProductPurchaseEntryReturnDto.purchaseEntryReturnDetails[i].quantity
          })
        }

        console.log('billDetailsArray:', billDetailsArray);
        console.log('inventoryIdsToUpdate:', inventoryIdsToUpdate);


        if (masterData.billNo === 0) throw new InternalServerErrorException('Technical error at bill generation. Contact support.')

        //here new value is being inserted to details
        const detailsResult = await eManager.insert(PurchaseReturnEntryDetailsEntity, billDetailsArray);
        if (detailsResult.identifiers[0].id < 0) throw new InternalServerErrorException('Failed product details creation.');


        console.log('detailsResult', detailsResult);

        //#region where inventory is being updated by decrementing with purchased return quantity in inventry update
        const inventoryReUpdates = await Promise.all(inventoryIdsToUpdate.map(async (productId, index) => {
          await eManager.decrement(InventoryEntity, { productId: productId }, 'quantity', inventoryQuantityArray[index].quantity);
        }));

        console.log('reUpdateInventoryData:', inventoryReUpdates);
        //#endregion 

        if (inventoryReUpdates.length === detailsResult.generatedMaps.length) return { message: 'Purchase Return entry update done.' }
        else throw new InternalServerErrorException("Failed to save bill/details!!");
      });
    }
    catch (err) {
      console.log('Error:', err);
      return { error: err.message, ErrMsg: 'Error while updating purchase data.' }
    }
  }
}
