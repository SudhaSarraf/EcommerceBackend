import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateProductIssueDto,
  ProductDto,
  SearchDto,
  UpdateProductIssueDto,
} from './dto/sales-entry.dto';
import {
  OrderStatus,
  PaymentOption,
  SalesEntryMasterEntity,
} from './entities/sales-entry-master.entity';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { SalesEntryDetailEntity } from './entities/sales-entry-details.entity';
import { InventoryEntity } from 'src/inventory/entities/inventory.entity';
import {
  arrangeProductsByCompany,
  calculateBillDetails,
} from 'src/common/product-grouping.service';
import { SuccessReturn } from 'src/common/success/successReturn';
import { EntityNotFoundException } from 'src/common/errors/entityNotFoundException';

@Injectable()
export class SalesEntryService {
  constructor(private readonly entityManager: EntityManager) { }

  async create(productDto: CreateProductIssueDto) {
    return await this.entityManager.transaction(async (eManager) => {
      try {
        //let productDto = new SalesEntryMasterEntity(productDto);

        console.log({ productDto: productDto, productDtoAll: productDto });

        const arrangedProducts = arrangeProductsByCompany(productDto.products);
        let bill = [];
        let billWithDetails = [];

        //here checking product bill group according to saler wise
        for (let i = 0; i < arrangedProducts.length; i++) {
          console.log({
            loopData: arrangedProducts[i],
            length: arrangedProducts.length,
          });
          const billDetails = calculateBillDetails(
            arrangedProducts[i],
            productDto.discPc,
            productDto.tax,
          );

          let exsistingYear = productDto.fiscalYear;
          let userId = productDto.userId;
          let date = new Date(productDto.date);
          let miti = productDto.miti;
          let paymentOption = productDto.paymentOption;
          let orderStatus = productDto.orderStatus;
          let billingAddress = productDto.billingAddress;
          let note = productDto.note;

          console.log({ length: arrangedProducts[i].length });

          let companyId = arrangedProducts[i][0].companyId;
          let latestBillData = await eManager.find(SalesEntryMasterEntity, {
            select: {
              billNo: true,
            },
            order: {
              billNo: 'DESC',
            },
          });

          let uptoBillNo = !latestBillData[0] ? 0 : latestBillData[0].billNo;
          let latestBillNo =
            latestBillData.length > 0
              ? latestBillData[0].billNo
              : uptoBillNo
                ? uptoBillNo
                : 0; //latestBillData ? uptoBillNo || 0 : 0;
          let newBillNo = latestBillNo + 1;

          if (!newBillNo || newBillNo === 0)
            throw new InternalServerErrorException(
              'Technical error at bill generation. Contact support.',
            );

          console.log(
            'latestBillData',
            latestBillData,
            '\n',
            'newBillNo',
            newBillNo,
          );

          const createdMasterData = eManager.create(SalesEntryMasterEntity, {
            userId: userId,
            billNo: newBillNo,
            voucherNo: ('Bill:- 0' + newBillNo).toString(),
            date: date,
            miti: miti,
            placedBy: null,
            billingAddress: billingAddress,
            total: billDetails.total,
            discPc: billDetails.discPc,
            discAmt: billDetails.discAmt,
            subTotal: billDetails.subTotal,
            tax: billDetails.tax,
            taxAmount: billDetails.taxAmount,
            netTotal: billDetails.netTotal,
            inWords: billDetails.inWords,
            paymentOption: paymentOption,
            orderStatus: orderStatus,
            updatedTimes: 0,
            fiscalYear: exsistingYear,
            note: note,
            companyId: companyId,
          });

          // console.log('productDto.salerData', productDto.salerData[i]);
          const savedMasterData = await eManager.save(
            SalesEntryMasterEntity,
            createdMasterData,
          );

          let masterData = savedMasterData; //savedMasterData.identifiers[0].id;
          if (masterData.billNo === 0)
            throw new InternalServerErrorException(
              'Technical error at bill generation. Contact support.',
            );

          console.log(masterData);

          let billDetailsArray = [];
          let inventoryQuantityArray = [];
          let inventoryIdsToUpdate = [];

          //here length starts form 1 so we must compare loop value starting from 1 or length -1
          for (let j = 0; j <= arrangedProducts[i].length - 1; j++) {
            console.log({ length: arrangedProducts[i].length, j: j });

            console.log({ checkingData: arrangedProducts[i][j] });

            billDetailsArray.push({
              masterId: masterData.id,
              billId: masterData.billNo,
              voucherNo: masterData.voucherNo,
              productId: arrangedProducts[i][j].productId,
              //productName: arrangedProducts[i][j].productName,
              brandId: arrangedProducts[i][j].brandId,
              categoryId: arrangedProducts[i][j].categoryId,
              quantity: arrangedProducts[i][j].quantity,
              unitId: arrangedProducts[i][j].unitId,
              pricePerUnit: arrangedProducts[i][j].pricePerUnit,
              totalPrice: arrangedProducts[i][j].totalPrice,
              status: true,
              updatedTimes: masterData.updatedTimes,
            });

            //seperating ids and quantities to alter inventory
            inventoryIdsToUpdate.push(arrangedProducts[i][i].productId);
            inventoryQuantityArray.push({
              quantity: arrangedProducts[i][i].quantity,
            });

            //here new value is being inserted to details
            var itemsResult = await eManager.save(
              SalesEntryDetailEntity,
              billDetailsArray
            );

            if (itemsResult[j].id < 0) throw new InternalServerErrorException('Failed product details creation.',);

            // Now, fetch the saved details with product names
            const detailsWithProductNames = await eManager.createQueryBuilder(SalesEntryDetailEntity, 'detail')
              .leftJoinAndSelect('detail.product', 'product')
              .where('detail.id IN (:...ids)', { ids: itemsResult.map(d => d.id) })
              .select([
                'detail',
                'product.productName as productName'
              ])
              .getRawMany();

            // Map the product names back to the saved details
            var detailsResult = itemsResult.map(detail => {
              const detailWithProductName = detailsWithProductNames.find(d => d.detail_id === detail.id);
              return {
                ...detail,
                productName: detailWithProductName ? detailWithProductName.productName : null
              };
            });

            //#region where inventory is being updated by incrementing with purchased quantity in inventry update
            const inventoryDecrement = await Promise.all(
              inventoryIdsToUpdate.map(async (productId, index) => {
                await eManager.decrement(
                  InventoryEntity,
                  { productId: productId },
                  'quantity',
                  inventoryQuantityArray[index].quantity,
                );
              }),
            );
            if (inventoryDecrement.length < 0)
              throw new InternalServerErrorException(
                'Failed product details creation.',
              );
          }
          bill.push(masterData);
          billWithDetails.push(masterData, { detailsResult });

          console.log({ billDetails: billDetails });
        }

        if (arrangedProducts.length === bill.length)
          return { bills: billWithDetails };
        else
          throw new InternalServerErrorException(
            'Failed to save bill/details!!',
          );
      } catch (error) {
        console.log({ error: error });
        return 'Failed to create sales data!!';
      }
    });
  }

  async updateOrderStatus(id: number, orderStatus: OrderStatus, userId: number) {
    try {

      let columnName: any;
      let operaterUser: any;

      switch (orderStatus) {
        case 'Accepted': {
          columnName = 'acceptedByUserOnDate'
          operaterUser = 'acceptedBy'
          break
        }
        case 'On_The_Way': {
          columnName = 'onTheWayByUserOnDate'
          operaterUser = 'onTheWayBy'
          break
        }
        case 'Reached': {
          columnName = 'reachedByUserOnDate'
          operaterUser = 'reachedBy'
          break
        }
        case 'Out_For_Delivery': {
          columnName = 'outForDeliveryByUserOnDate'
          operaterUser = 'outForDeliveryBy'
          break
        }
        case 'Delivered': {
          columnName = 'deliveredByUserOnDate'
          operaterUser = 'deliveredBy'
          break
        }
        default: {
          break;
        }
      }

      let condition: any = {
        orderStatus: orderStatus
      };
      condition[columnName] = new Date();
      condition[operaterUser] = userId;

      let result = await this.entityManager.update(SalesEntryMasterEntity, id, condition);

      if (result.affected > 0) return SuccessReturn(`Order status updated to ${orderStatus}`);
      else throw new InternalServerErrorException(`Error while updating order status to ${orderStatus}`)

    } catch (error) {
      throw error;
    }
  }

  async updateCancel(masterId: number) {
    return await this.entityManager.transaction(async (eManager) => {
      try {
        let inventoryQuantityArray = [];
        let inventoryIdsToUpdate = [];

        const getProductDetails = await eManager.find(SalesEntryDetailEntity, {
          where: {
            masterId: masterId,
            //status: true
          },
          select: {
            productId: true,
            quantity: true,
            status: true,
          },
        });

        if (getProductDetails[0].status === false)
          throw new ForbiddenException('This bill is already cancelled..');

        for (let j = 0; j <= getProductDetails.length - 1; j++) {
          console.log({
            length: getProductDetails.length,
            j: j,
            getProductDetails: getProductDetails,
          });

          //seperating ids and quantities to alter inventory
          inventoryIdsToUpdate.push(getProductDetails[j].productId);
          inventoryQuantityArray.push({
            quantity: getProductDetails[j].quantity,
          });

          //#region where inventory is being updated by incrementing with purchased quantity in inventry update
          const inventoryIncrement = await Promise.all(
            inventoryIdsToUpdate.map(async (productId, index) => {
              await eManager.increment(
                InventoryEntity,
                { productId: productId },
                'quantity',
                inventoryQuantityArray[index].quantity,
              );
            }),
          );
          if (inventoryIncrement.length < 0)
            throw new InternalServerErrorException(
              'Failed product details creation.',
            );
        }

        //here new value is being inserted to details
        var detailsResult = await eManager.update(
          SalesEntryDetailEntity,
          { masterId: masterId },
          {
            status: false,
          },
        );
        if (detailsResult.affected < 0)
          throw new InternalServerErrorException(
            'Failed product details creation.',
          );

        const savedMasterData = await eManager.save(SalesEntryMasterEntity, {
          id: masterId,
          orderStatus: OrderStatus.cancelled,
        });

        // let masterData = savedMasterData;//savedMasterData.identifiers[0].id;

        if (savedMasterData.orderStatus === OrderStatus.cancelled)
          return SuccessReturn(`Bill is cancelled successfully.`);
        else
          throw new InternalServerErrorException(
            'Failed to save bill/details!!',
          );
      } catch (error) {
        console.log({ error: error });
        throw error;
      }
    });
  }

  async findAll(
    companyId: number,
    orderStatus: OrderStatus,
    paymentOption: PaymentOption,
  ) {
    try {
      const result = await this.entityManager.find(SalesEntryMasterEntity, {
        where: {
          companyId: companyId,
          orderStatus: orderStatus,
          paymentOption: paymentOption,
        },
        select: {
          userId: true,
          billNo: true,
          voucherNo: true,
          date: true,
          miti: true,
          billingAddress: true,
          note: true,
          companyId: true,
          company: {
            name: true,
          },
          placedBy: true,
          total: true,
          discPc: true,
          discAmt: true,
          subTotal: true,
          tax: true,
          taxAmount: true,
          netTotal: true,
          inWords: true,
          paymentOption: true,
          orderStatus: true,
          updatedTimes: true,
          fiscalYear: true,
          salesDetails: {
            id: true,
            masterId: true,
            billId: true,
            voucherNo: true,
            productId: true,
            product: {
              productName: true,
              productCode: true,
            },
            categoryId: true,
            category: {
              categoryName: true,
            },
            brandId: true,
            brand: {
              brandName: true,
            },
            quantity: true,
            unitId: true,
            pricePerUnit: true,
            totalPrice: true,
            createdDate: true,
            updatedDate: true,
            status: true,
            updatedTimes: true,
          },
        },
        relations: [
          'company',
          'salesDetails',
          'salesDetails.product',
          'salesDetails.category',
          'salesDetails.brand',
        ],
      });

      if (result) return result;
      else return new EntityNotFoundException('No data found');
    } catch (error) {
      throw new error();
    }
  }

  async findByUserId(
    companyId: number,
    orderStatus: OrderStatus,
    paymentOption: PaymentOption,
    userId: number,
  ) {
    try {
      const result = await this.entityManager.find(SalesEntryMasterEntity, {
        where: {
          companyId: companyId,
          orderStatus: orderStatus,
          paymentOption: paymentOption,
          userId: userId, // Added condition to filter by userId
        },
        select: {
          userId: true,
          billNo: true,
          voucherNo: true,
          date: true,
          miti: true,
          billingAddress: true,
          note: true,
          companyId: true,
          company: {
            name: true,
          },
          placedBy: true,
          total: true,
          discPc: true,
          discAmt: true,
          subTotal: true,
          tax: true,
          taxAmount: true,
          netTotal: true,
          inWords: true,
          paymentOption: true,
          orderStatus: true,
          updatedTimes: true,
          fiscalYear: true,
          salesDetails: {
            id: true,
            masterId: true,
            billId: true,
            voucherNo: true,
            productId: true,
            product: {
              productName: true,
              productCode: true,
              images: true,
            },
            categoryId: true,
            category: {
              categoryName: true,
            },
            brandId: true,
            brand: {
              brandName: true,
            },
            quantity: true,
            unitId: true,
            pricePerUnit: true,
            totalPrice: true,
            createdDate: true,
            updatedDate: true,
            status: true,
            updatedTimes: true,
          },
        },
        relations: [
          'company',
          'salesDetails',
          'salesDetails.product',
          'salesDetails.category',
          'salesDetails.brand',
        ],
        order: {
          id: 'DESC',
        },
      });

      if (result) return result;
      else throw new EntityNotFoundException('No data found');
    } catch (error) {
      throw error;
    }
  }

  public async countAllSales(companyId: number) {
    return await this.entityManager.count(SalesEntryDetailEntity, {
      where: {
        status: true,
      },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} salesEntry`;
  // }

  //update bill is to be updated later
  // async update(masterId: number, productDto: UpdateProductIssueDto) {
  //   return await this.entityManager.transaction(async (eManager) => {
  //     try {
  //       //let productDto = new SalesEntryMasterEntity(productDto);

  //       console.log({ productDto: productDto, productDtoAll: productDto })

  //       const arrangedProducts = arrangeProductsByCompany(productDto.products);
  //       let bill = [];
  //       let billWithDetails = [];

  //       //here checking product bill group according to saler wise
  //       for (let i = 0; i < arrangedProducts.length; i++) {
  //         console.log({ loopData: arrangedProducts[i], length: arrangedProducts.length })

  //         const billDetails = calculateBillDetails(arrangedProducts[i], productDto.discPc, productDto.tax);

  //         // let id = masterId;
  //         // let exsistingYear = productDto.fiscalYear;
  //         // let userId = productDto.userId;
  //         // let date = new Date(productDto.date);
  //         // let miti = productDto.miti;
  //         let paymentOption = productDto.paymentOption;
  //         let orderStatus = productDto.orderStatus;
  //         let billingAddress = productDto.billingAddress;
  //         let note = productDto.note;

  //         const createdMasterData = eManager.create(SalesEntryMasterEntity, {
  //           id:masterId,
  //           billingAddress: billingAddress,
  //           total: billDetails.total,
  //           discPc: billDetails.discPc,
  //           discAmt: billDetails.discAmt,
  //           subTotal: billDetails.subTotal,
  //           tax: billDetails.tax,
  //           taxAmount: billDetails.taxAmount,
  //           netTotal: billDetails.netTotal,
  //           inWords: billDetails.inWords,
  //           orderStatus: orderStatus,
  //           updatedTimes: 0
  //         })

  //         // console.log('productDto.salerData', productDto.salerData[i]);
  //         const savedMasterData = await eManager.save(SalesEntryMasterEntity, createdMasterData);

  //         let masterData = savedMasterData;//savedMasterData.identifiers[0].id;
  //         if (masterData.billNo === 0) throw new InternalServerErrorException('Technical error at bill generation. Contact support.');

  //         console.log(masterData)

  //         let billDetailsArray = [];
  //         let inventoryQuantityArray = [];
  //         let inventoryIdsToUpdate = [];

  //         //here length starts form 1 so we must compare loop value starting from 1 or length -1
  //         for (let j = 0; j <= (arrangedProducts[i].length) - 1; j++) {

  //           console.log({ length: arrangedProducts[i].length, j: j })

  //           console.log({ checkingData: arrangedProducts[i][j] })

  //           billDetailsArray.push({
  //             masterId: masterData.id,
  //             billId: masterData.billNo,
  //             voucherNo: masterData.voucherNo,
  //             productId: arrangedProducts[i][j].productId,
  //             brandId: arrangedProducts[i][j].brandId,
  //             categoryId: arrangedProducts[i][j].categoryId,
  //             quantity: arrangedProducts[i][j].quantity,
  //             unitId: arrangedProducts[i][j].unitId,
  //             pricePerUnit: arrangedProducts[i][j].pricePerUnit,
  //             totalPrice: arrangedProducts[i][j].totalPrice,
  //             status: true,
  //             updatedTimes: masterData.updatedTimes
  //           })

  //           //seperating ids and quantities to alter inventory
  //           inventoryIdsToUpdate.push(arrangedProducts[i][i].productId)
  //           inventoryQuantityArray.push({
  //             quantity: arrangedProducts[i][i].quantity
  //           })

  //           //here new value is being inserted to details
  //           var detailsResult = await eManager.save(SalesEntryDetailEntity, billDetailsArray);
  //           if (detailsResult[j].id < 0) throw new InternalServerErrorException('Failed product details creation.');

  //           //#region where inventory is being updated by incrementing with purchased quantity in inventry update
  //           const inventoryDecrement = await Promise.all(inventoryIdsToUpdate.map(async (productId, index) => {
  //             await eManager.decrement(InventoryEntity, { productId: productId }, 'quantity', inventoryQuantityArray[index].quantity);
  //           }));
  //           if (inventoryDecrement.length < 0) throw new InternalServerErrorException('Failed product details creation.');
  //         }
  //         bill.push(masterData);
  //         billWithDetails.push(masterData, { detailsResult })

  //         console.log({ billDetails: billDetails })
  //       }

  //       if (arrangedProducts.length === bill.length) return { bills: billWithDetails }
  //       else throw new InternalServerErrorException("Failed to save bill/details!!");

  //     }
  //     catch (error) {
  //       console.log({ error: error })
  //       return "Failed to create sales data!!";
  //     }

  //   });
  // }

  // async create(productDto: CreateProductIssueDto) {
  //   return await this.entityManager.transaction(async (eManager) => {
  //     try {
  //       //let productDto = new SalesEntryMasterEntity(productDto);

  //       console.log({ productDto: productDto, productDtoAll: [productDto, productDto.salerData[0], productDto.salerData[1]] })

  //       let exsistingYear = productDto.fiscalYear

  //       let bill = [];
  //       let billWithDetails = [];

  //       for (let i = 0; i < productDto.salerData.length; i++) {

  //         let latestBillData = await eManager.find(SalesEntryMasterEntity, {
  //           select: {
  //             billNo: true,
  //           },
  //           order: {
  //             billNo: 'DESC',
  //           },
  //         })

  //         let uptoBillNo = !latestBillData[0] ? 0 : latestBillData[0].billNo;
  //         let latestBillNo = latestBillData.length > 0 ? latestBillData[0].billNo : (uptoBillNo ? uptoBillNo : 0)//latestBillData ? uptoBillNo || 0 : 0;
  //         let newBillNo = latestBillNo + 1;

  //         if (!newBillNo || newBillNo === 0) throw new InternalServerErrorException('Technical error at bill generation. Contact support.');

  //         console.log('latestBillData', latestBillData, '\n', 'newBillNo', newBillNo);

  //         const createdMasterData = eManager.create(SalesEntryMasterEntity, {
  //           userId: productDto.userId,
  //           billNo: newBillNo,
  //           voucherNo: ("Bill:- 0" + newBillNo).toString(),
  //           date: new Date(productDto.date),
  //           miti: productDto.miti,
  //           placedBy: null,
  //           billingAddress: productDto.billingAddress,
  //           total: productDto.salerData[i].total,
  //           discPc: productDto.salerData[i].discPc,
  //           discAmt: productDto.salerData[i].discAmt,
  //           subTotal: productDto.salerData[i].subTotal,
  //           tax: productDto.salerData[i].tax,
  //           taxAmount: productDto.salerData[i].taxAmount,
  //           netTotal: productDto.salerData[i].netTotal,
  //           inWords: productDto.salerData[i].inWords,
  //           paymentOption: productDto.salerData[i].paymentOption,
  //           orderStatus: productDto.salerData[i].orderStatus,
  //           updatedTimes: 0,
  //           fiscalYear: exsistingYear,
  //           note: productDto.note,
  //           companyId: productDto.companyId
  //         })

  //         console.log('productDto.salerData', productDto.salerData[i]);
  //         const savedMasterData = await eManager.save(SalesEntryMasterEntity, createdMasterData);

  //         let masterData = savedMasterData;//savedMasterData.identifiers[0].id;
  //         if (masterData.billNo === 0) throw new InternalServerErrorException('Technical error at bill generation. Contact support.');

  //         console.log(masterData)

  //         let billDetailsArray = [];
  //         let inventoryQuantityArray = [];
  //         let inventoryIdsToUpdate = [];

  //         //here length starts form 1 so we must compare loop value starting from 1 or length -1
  //         for (let j = 0; j <= (productDto.salerData[i].products.length - 1); i++) {

  //           billDetailsArray.push({
  //             masterId: masterData.id,
  //             billId: masterData.billNo,
  //             voucherNo: masterData.voucherNo,
  //             productId: productDto.salerData[i].products[j].productId,
  //             categoryId: productDto.salerData[i].products[j].categoryId,
  //             quantity: productDto.salerData[i].products[j].quantity,
  //             unitId: productDto.salerData[i].products[j].unitId,
  //             pricePerUnit: productDto.salerData[i].products[j].pricePerUnit,
  //             totalPrice: productDto.salerData[i].products[j].totalPrice,
  //             status: true,
  //             updatedTimes: masterData.updatedTimes
  //           })

  //           //seperating ids and quantities to alter inventory
  //           inventoryIdsToUpdate.push(productDto.salerData[i].products[j].productId)
  //           inventoryQuantityArray.push({
  //             quantity: productDto.salerData[i].products[j].quantity
  //           })

  //           //here new value is being inserted to details
  //           var detailsResult = await eManager.save(SalesEntryDetailEntity, billDetailsArray);
  //           if (detailsResult[j].id < 0) throw new InternalServerErrorException('Failed product details creation.');

  //           //#region where inventory is being updated by incrementing with purchased quantity in inventry update
  //           const inventoryDecrement = await Promise.all(inventoryIdsToUpdate.map(async (productId, index) => {
  //             await eManager.decrement(InventoryEntity, { productId: productId }, 'quantity', inventoryQuantityArray[index].quantity);
  //           }));
  //           if (inventoryDecrement.length < 0) throw new InternalServerErrorException('Failed product details creation.');
  //         }
  //         bill.push(masterData);
  //         billWithDetails.push(masterData, { detailsResult })
  //       }

  //       if (productDto.salerData.length === bill.length) return { bills: billWithDetails }
  //       else throw new InternalServerErrorException("Failed to save bill/details!!");
  //     }
  //     catch (error) {
  //       console.log({ error: error })
  //       return "Failed to create sales data!!";
  //     }

  //   });
  // }
}
