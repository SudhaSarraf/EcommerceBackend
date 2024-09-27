import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';
import { EntityNotFoundException } from 'src/common/errors/entityNotFoundException';
import { PurchaseEntryMasterEntity } from './entities/productPurchaseEntryMaster.entity';
import { PurchaseEntryDetailEntity } from './entities/productPurchaseEntryDetails.entity';
import { CreateProductPurchaseEntryDto, UpdateProductPurchaseEntryDto } from './dto/product-purchase-entry.dto';

@Injectable()
export class PurchaseEntryService {
  constructor(private readonly entityManager: EntityManager) {}

    async create(createProductPurchaseEntryDto: CreateProductPurchaseEntryDto) {
      return await this.entityManager.transaction(async (eManager) => {
        const { purchaseEntryDetails, ...purchaseEntryData } =
          createProductPurchaseEntryDto;

        // Create the purchase entry
        const purchaseEntry = eManager.create(
          PurchaseEntryMasterEntity,
          purchaseEntryData,
        );
        const savedPurchaseEntry = await eManager.save(purchaseEntry);

      //   console.log('Saved purchase entry with ID:', savedPurchaseEntry.id);

        // Array to store details
        let purchaseEntryDetailsArray = [];

        for (let i = 0; i < purchaseEntryDetails.length; i++) {
          const detailDto = purchaseEntryDetails[i];

          // Fetch the product to get unit, category, and brand details
          const product = await eManager.findOne(ProductEntity, {
            where: { id: detailDto.productId },
          });
          if (!product) {
            throw new InternalServerErrorException(
              `Product with ID ${detailDto.productId} not found`,
            );
          }

          // Extract unitId, categoryId, and brandId from the product
          const unitId = product.unitId;
          const categoryId = product.categoryId;
          const brandId = product.brandId;

          // Prepare detail object for insertion with extracted data
          purchaseEntryDetailsArray.push({
            ...detailDto,
            productId: detailDto.productId,
            quantity: detailDto.quantity,
            purchaseEntry: savedPurchaseEntry,
            unitId,
            categoryId,
            brandId,
            status: true,
            createdDate: new Date(),
          });

          // Update inventory quantity
          let inventory = await eManager.findOne(InventoryEntity, {
            where: { productId: detailDto.productId },
          });
          if (inventory) {
            inventory.quantity = parseFloat(
              (
                parseFloat(inventory.quantity.toString()) +
                parseFloat(detailDto.quantity.toString())
              ).toFixed(4),
            );
            inventory.updatedAt = new Date();
            await eManager.save(InventoryEntity, inventory);
          } else {
            throw new InternalServerErrorException(
              `Inventory with Product ID ${detailDto.productId} not found`,
            );
          }
        }

        // Insert all details at once
        const detailsResult = await eManager.save(
          PurchaseEntryDetailEntity,
          purchaseEntryDetailsArray,
        );

        console.log('Saved purchase entry details:', detailsResult);

        // Retrieve the full purchase entry with details
        const fullPurchaseEntry = await eManager.findOne(
          PurchaseEntryMasterEntity,
          {
            where: { id: savedPurchaseEntry.id },
            relations: ['purchase_entry_details'],
          },
        );

        if (!fullPurchaseEntry) {
          throw new InternalServerErrorException(
            'Purchase entry not found after creation',
          );
        }

        return fullPurchaseEntry;
      });
    }

  async findAllPurchaseMaster(companyId: number) {
    const purchaseEntryData = await this.entityManager.find(
      PurchaseEntryMasterEntity,
      {
        where: {
          // companyId: companyId,
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
          // purchaseOrderNo: true,
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
          enteredBy: true,
          // companyId: true,
          createdDate: true,
          updatedDate: true,
          // company: {
          //   name: true,
          //   address: true,
          //   mobile: true,
          //   regNo: true,
          //   email: true,
          // },
          purchase_entry_details: {
            masterId: true,
            billId: true,
            voucherNo: true,
            quantity: true,
            productId: true,
            brandId: true,
            categoryId: true,
            unitId: true,
            pricePerUnit: true,
            totalPrice: true,
            // companyId: true,
            product: {
              productName: true,
              productCode: true,
              barcode: true,
              images: true,
            },
            category: {
              categoryName: true,
            },
            brand: {
              brandName: true,
            },
            unit: {
              unitName: true,
            },
          },
        },
        relations: [
          'purchase_entry_details',
          'company',
        ],
        order: {
          id: 'DESC',
        },
      },
    );

    if (purchaseEntryData.length > 0) return purchaseEntryData;
    else {
      throw new EntityNotFoundException();
    }
  }

    async findAllDetails(companyId: number, masterId: number) {
      const purchaseDetailsData = await this.entityManager.find(
        PurchaseEntryDetailEntity,
        {
          where: {
            masterId: masterId,
            companyId: companyId
          },
          select:  {
            masterId: true,
            billId: true,
            voucherNo: true,
            quantity: true,
            productId: true,
            brandId: true,
            categoryId: true,
            unitId: true,
            pricePerUnit: true,
            totalPrice: true,
            // companyId: true,
            product: {
              productName: true,
              productCode: true,
              barcode: true,
              images: true,
            },
            category: {
              categoryName: true,
            },
            brand: {
              brandName: true,
            },
            unit: {
              unitName: true,
            },
            // company: {
            //   name: true,
            //   address: true,
            //   mobile: true,
            //   regNo: true,
            //   email: true,
            // },
          },
          relations: [
            'purchaseEntry',
            'product',
            'category',
            'brand',
            'unit',
            'company',
          ],
          order: {
            id: 'DESC',
          },
        },
      );

      if (purchaseDetailsData.length > 0) return purchaseDetailsData;
      else {
        throw new EntityNotFoundException();
      }
    }

    async findOne(id: number) {
      const result = await this.entityManager.findOne(PurchaseEntryDetailEntity, {
        where: {
          id: id,
        },
        select:  {
          masterId: true,
          billId: true,
          voucherNo: true,
          quantity: true,
          productId: true,
          brandId: true,
          categoryId: true,
          unitId: true,
          pricePerUnit: true,
          totalPrice: true,
          // companyId: true,
          product: {
            productName: true,
            productCode: true,
            barcode: true,
            images: true,
          },
          category: {
            categoryName: true,
          },
          brand: {
            brandName: true,
          },
          unit: {
            unitName: true,
          },
          // company: {
          //   name: true,
          //   address: true,
          //   mobile: true,
          //   regNo: true,
          //   email: true,
          // },
        },
        relations: [
          'purchaseEntry',
          'product',
          'category',
          'brand',
          'unit',
          'company',
        ],
      });
      if (result) return result;
      else throw new EntityNotFoundException();
    }

    async update(id: number, updateProductPurchaseEntryDto: UpdateProductPurchaseEntryDto) {
      try {
        let entryData = new PurchaseEntryMasterEntity(updateProductPurchaseEntryDto)
        return await this.entityManager.transaction(async eManager => {
          // let exsistingYear = await eManager.findOne(FiscalYearEntity, {
          //   where: {
          //     isActive: true
          //   },
          //   select: {
          //     id: true,
          //     yearCode: true
          //   }
          // });
  
          // console.log('exsistingYear', exsistingYear)
  
          // if (exsistingYear === null) return { error: "Error getting fiscal year data. Contact support." }
  
          // console.log('exsistingYear:', exsistingYear);
  
          let latestUpdatedTime = (await eManager.createQueryBuilder()
            .select("updatedTimes")
            .from(PurchaseEntryMasterEntity, "entity")
            .where("entity.id = :id", { id: id })
            .getRawOne()).updatedTimes + 1;
  
          console.log('currentUpdatedTimes', latestUpdatedTime);
          if (!latestUpdatedTime || latestUpdatedTime < 0) throw new InternalServerErrorException('Updated Times Generation Failed.');
  
          let updatedRecord = await eManager.update(PurchaseEntryMasterEntity, id, {
            date: new Date(entryData.date),
            miti: entryData.miti,
            partyName: entryData.partyName ? entryData.partyName : 'CASH A/C',
            address: entryData.address ? entryData.address : null,
            refBill: entryData.refBill ? entryData.refBill : null,
            puchaseOrderNo: null,
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
  
          let masterData = await eManager.findOne(PurchaseEntryMasterEntity, {
            where: {
              id: id
            },
            select: {
              id: true,
              billNo: true,
              voucherNo: true,
              updatedTimes: true
            }
          });
  
          let previouslyInsertedQuantity = await eManager.find(PurchaseEntryDetailEntity, {
            where: {
              masterId: id,
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
  
          if (previouslyInsertedQuantity.length <= 0) throw new EntityNotFoundException('Cannot find details related to this bill.')
  
          let inventoryIdsToDecrease = [];
          let inventoryQuantityToDecreaseArray = [];
          let billDetailsArray = [];
          let inventoryIdsToUpdate = [];
          let inventoryQuantityArray = [];
  
          //BINDING PREVIOUS PRODUCT ITEMS QUANTITY AND ID TO THE ARRAY
          for (let i = 0; i < previouslyInsertedQuantity.length; i++) {
            inventoryIdsToDecrease.push(previouslyInsertedQuantity[i].productId)
            inventoryQuantityToDecreaseArray.push({
              quantity: previouslyInsertedQuantity[i].quantity //error here
            })
          }
  
          console.log('inventoryIdsToDecrease:', inventoryIdsToDecrease);
          console.log('inventoryQuantityToDecreaseArray:', inventoryQuantityToDecreaseArray);
  
  
          //#region where inventory is being updated by decerementing the previously entered record by purchased quantity in inventry update
          const inventoryDecrement = await Promise.all(inventoryIdsToDecrease.map(async (productId, index) => {
            await eManager.decrement(InventoryEntity, { productId: productId }, 'quantity', inventoryQuantityToDecreaseArray[index].quantity);
          }));
          //#end region
  
          console.log('inventoryDecrement', inventoryDecrement);
  
          //#endregion      
  
          let disablePreviousItems = await eManager.update(PurchaseEntryDetailEntity, { masterId: id, updatedTimes: entryData.updatedTimes }, {
            status: false
          });
  
          console.log('disablePreviousItems:', disablePreviousItems);
          if (disablePreviousItems.affected < previouslyInsertedQuantity.length) throw new InternalServerErrorException('Error while altering previous record.');
  
          //BINDING NEW UPDATED DATA OF ITEM DETAILS TO ENTER TO THE TABLE AND UPDATE THE INVENTORY WITH NEW RECORD
          for (let i = 0; i < updateProductPurchaseEntryDto.purchaseEntryDetails.length; i++) {
            billDetailsArray.push({
              masterId: masterData.id,
              billId: masterData.billNo,
              voucherNo: masterData.voucherNo,
              productId: updateProductPurchaseEntryDto.purchaseEntryDetails[i].productId,
              categoryId: updateProductPurchaseEntryDto.purchaseEntryDetails[i].categoryId,
              quantity: updateProductPurchaseEntryDto.purchaseEntryDetails[i].quantity,
              unitId: updateProductPurchaseEntryDto.purchaseEntryDetails[i].unitId,
              brandId: updateProductPurchaseEntryDto.purchaseEntryDetails[i].brandId,
              pricePerUnit: updateProductPurchaseEntryDto.purchaseEntryDetails[i].pricePerUnit,
              totalPrice: updateProductPurchaseEntryDto.purchaseEntryDetails[i].totalPrice,
              status: true,
              updatedTimes: masterData.updatedTimes,
              activeData: true,
              // fiscalYear: exsistingYear.yearCode
            });
  
            inventoryIdsToUpdate.push(updateProductPurchaseEntryDto.purchaseEntryDetails[i].productId)
            inventoryQuantityArray.push({
              quantity: updateProductPurchaseEntryDto.purchaseEntryDetails[i].quantity //error here
            })
          }
  
          console.log('billDetailsArray:', billDetailsArray);
          console.log('inventoryIdsToUpdate:', inventoryIdsToUpdate);
  
          if (masterData.billNo === 0) throw new InternalServerErrorException('Technical error at bill generation. Contact support.');
  
          //here new value is being inserted to details
          const detailsResult = await eManager.insert(PurchaseEntryDetailEntity, billDetailsArray);
          if (detailsResult.identifiers[0].id < 0) throw new InternalServerErrorException('Failed product details creation.');
  
          //#region where inventory is being updated by incrementing with purchased quantity in inventry update
          const inventoryReUpdates = await Promise.all(inventoryIdsToUpdate.map(async (productId, index) => {
            await eManager.increment(InventoryEntity, { productId: productId }, 'quantity', inventoryQuantityArray[index].quantity);
          }));
          //#end region
  
          if (inventoryReUpdates.length === detailsResult.generatedMaps.length) return { message: 'Purchase entry update done.' }
          else throw new InternalServerErrorException("Failed to save bill/details!!");
        });
      }
      catch (error) {
        throw error
      }
    }

    public async countAllPurchase(companyId: number) {
      return await this.entityManager.count(PurchaseEntryDetailEntity, {
        where: {
          status: true,
        },
      });
    }
}
