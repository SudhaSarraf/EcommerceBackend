import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateBillDto, UpdateBillDto } from './dto/bill.dto';
import {
  BillMasterEntity,
  OrderStatus,
} from './entities/orderBill-master.entity';
import { BillDetailEntity } from './entities/orderBill-detail.entity';
import { EntityNotFoundException } from 'src/common/errors/entityNotFoundException';

@Injectable()
export class BillService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createBillDto: CreateBillDto) {
    try {
      const entryData = new BillMasterEntity(createBillDto);

      return await this.entityManager.transaction(async (eManager) => {
        // Fetch latest bill number
        const latestBillData = await eManager.find(BillMasterEntity, {
          where: {
            status: true,
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
              : 0;
        let newBillNo = latestBillNo + 1;

        if (!newBillNo || newBillNo === 0)
          throw new InternalServerErrorException(
            'Technical error at bill generation. Contact support.',
          );

        const newDate = new Date();

        let year = newDate.getFullYear().toString().slice(-2);
        let month = (newDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1 and pad with 0 if necessary
        let day = newDate.getDate().toString().padStart(2, '0'); // Get the day of the month and pad with 0 if necessary

        const formattedDate = `${year}${month}${day}`;
        let barcode = `${formattedDate}${entryData.userId}${newBillNo}`;

        const savedMasterData = await eManager.insert(BillMasterEntity, {
          billNo: newBillNo,
          voucherNo: ('Bill:- 0' + newBillNo).toString(),
          // date: entryData.date,
          userId: entryData.userId,
          subTotal: entryData.subTotal,
          vat: entryData.vat,
          vatAmt: entryData.vatAmt,
          // tax: entryData.tax,
          totalAmount: entryData.totalAmount,
          discount: entryData.discount,
          discountAmt: entryData.discountAmt,
          grandTotal: entryData.grandTotal,
          paid: entryData.paid,
          due: entryData.due,
          paymentType: entryData.paymentType,
          paymentStatus: entryData.paymentStatus,
          status: true,
          orderStatus: OrderStatus.pending,
          file: entryData.file ? entryData.file : 'N/A',
          fiscalYear: entryData.fiscalYear,
          createdDate: new Date(),
          barCode: barcode,
        });

        const masterId = savedMasterData.identifiers[0].id;

        const masterData = await eManager.findOne(BillMasterEntity, {
          where: {
            id: masterId,
          },
          select: {
            id: true,
            billNo: true,
            voucherNo: true,
          },
        });

        let billDetailsArray: {}[] = [];

        for (let i = 0; i < createBillDto.billItemsDetails.length; i++) {
          billDetailsArray.push({
            billId: masterData.id,
            billNo: masterData.billNo,
            voucherNo: masterData.voucherNo,
            orderId: createBillDto.billItemsDetails[i].orderId,
            quantity: createBillDto.billItemsDetails[i].quantity,
            rate: createBillDto.billItemsDetails[i].rate,
            total: createBillDto.billItemsDetails[i].total,
            fiscalYear: entryData.fiscalYear,
            createdDate: new Date(),
          });
        }
        console.log('masterData', masterData);

        const detailsResult = await eManager.insert(
          BillDetailEntity,
          billDetailsArray,
        );
        if (detailsResult.identifiers[0].id < 0)
          throw new InternalServerErrorException(
            'Failed product details creation.',
          );
        //#end region

        if (detailsResult.generatedMaps.length)
          return { message: 'Test bill created for client.' };
        else
          throw new InternalServerErrorException(
            'Failed to save bill/details!!',
          );
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAllMaster() {
    try {
      const result = await this.entityManager.find(BillMasterEntity, {
        where: {
          status: true,
        },
        select: {
          billNo: true,
          voucherNo: true,
          orderDate: true,
          userId: true,
          subTotal: true,
          vat: true,
          vatAmt: true,
          totalAmount: true,
          discount: true,
          discountAmt: true,
          grandTotal: true,
          paid: true,
          due: true,
          paymentType: true,
          paymentStatus: true,
          status: true,
          orderStatus: true,
          file: true,
          createdDate: true,
          updatedDate: true,
          updatedTimes: true,
          fiscalYear: true,
          isCancelled: true,
          barCode: true,
          user: {
            firstName: true,
            lastName: true,
          },
          billDetails: {
            id: true,
            billId: true,
            billNo: true,
            voucherNo: true,
            // orderId:true,
            quantity: true,
            rate: true,
            total: true,
            status: true,
            createdDate: true,
            updatedDate: true,
            updatedTimes: true,
            fiscalYear: true,
          },
        },
        relations: ['user', 'billDetails'],
      });
      if (result.length > 0) return result;
      else throw new EntityNotFoundException();
    } catch (error) {
      throw error;
    }
  }

  async findAllDetails(masterId: number) {
    try {
      const result = await this.entityManager.find(BillDetailEntity, {
        where: {
          billId: masterId,
          status: true,
        },
        select: {
          id: true,
          // orderId:true,
          billId: true,
          quantity: true,
          rate: true,
          total: true,
          status: true,
          createdDate: true,
          updatedDate: true,
          updatedTimes: true,
          fiscalYear: true,
          isCancelled: true,
          billNo: true,
          voucherNo: true,
          // orderM: {
          //   orderItems: true,
          // }
        },
        relations: ['order', 'product', 'billMaster'],
      });
      if (result.length > 0) return result;
      else throw new EntityNotFoundException();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.entityManager.findOne(BillDetailEntity, {
        where: {
          id: id,
          status: true,
        },
        select: {
          id: true,
          // orderId:true,
          billId: true,
          quantity: true,
          rate: true,
          total: true,
          status: true,
          createdDate: true,
          updatedDate: true,
          updatedTimes: true,
          fiscalYear: true,
          isCancelled: true,
          // order: {
          //   orderItems: true,
          // },
          billMaster: {
            billNo: true,
            voucherNo: true,
          },
        },
        relations: ['product', 'order', 'billMaster'],
      });
      if (result) return result;
      else throw new EntityNotFoundException();
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateBillDto: UpdateBillDto) {
    try {
      let entryData = new BillMasterEntity(updateBillDto);
      // let itemEntryData = new TestBillDetailsEntity(createTestBillItemDto);
      return await this.entityManager.transaction(async (eManager) => {
        let checkIsCancelled = await eManager.findOne(BillMasterEntity, {
          where: {
            id: id,
            status: true,
          },
        });

        if (checkIsCancelled.isCancelled === true)
          throw new InternalServerErrorException(
            'This bill is already cancelled',
          );

        let latestUpdatedTime =
          (
            await eManager
              .createQueryBuilder()
              .select('updatedTimes')
              .from(BillMasterEntity, 'entity')
              .where('entity.id = :id', { id: id })
              .getRawOne()
          ).updatedTimes + 1;

        if (!latestUpdatedTime || latestUpdatedTime < 0)
          throw new InternalServerErrorException(
            'Updated Times Generation Failed.',
          );

        let updateMasterData = await eManager.update(
          BillMasterEntity,
          { id: id },
          {
            subTotal: entryData.subTotal,
            vat: entryData.vat,
            vatAmt: entryData.vatAmt,
            totalAmount: entryData.totalAmount,
            discount: entryData.discount,
            discountAmt: entryData.discountAmt,
            grandTotal: entryData.grandTotal,
            paid: entryData.paid,
            due: entryData.due,
            paymentType: entryData.paymentType,
            paymentStatus: entryData.paymentStatus,
            status: entryData.status,
            orderStatus: entryData.orderStatus,
            userId: entryData.userId,
            file: entryData.file,
            updatedTimes: latestUpdatedTime,
            updatedDate: new Date(),
          },
        );

        if (updateMasterData.affected === 0)
          throw new InternalServerErrorException('Error updating lab bill.');

        let deleteDetails = await eManager.delete(BillDetailEntity, {
          billId: id,
        });

        if (deleteDetails.affected === 0)
          throw new InternalServerErrorException(
            'Error in bill details alteration.',
          );

        let billDetailsArray: {}[] = [];

        for (let i = 0; i < updateBillDto.billItemsDetails.length; i++) {
          billDetailsArray.push({
            billId: id,
            billNo: entryData.billNo,
            voucherNo: entryData.voucherNo,
            orderId: updateBillDto.billItemsDetails[i].orderId,
            quantity: updateBillDto.billItemsDetails[i].quantity,
            rate: updateBillDto.billItemsDetails[i].rate,
            total: updateBillDto.billItemsDetails[i].total,
            updatedTimes: latestUpdatedTime,
            fiscalYear: entryData.fiscalYear,
            updatedDate: new Date(),
          });
        }

        //here new value is being inserted to details
        const detailsResult = await eManager.insert(
          BillDetailEntity,
          billDetailsArray,
        );
        if (detailsResult.identifiers[0].id < 0)
          throw new InternalServerErrorException(
            'Failed product details updation.',
          );
        //#end region

        if (detailsResult.identifiers[0].id > 0)
          return { message: 'Test bill updated for client.' };
        else
          throw new InternalServerErrorException(
            'Failed to save bill/details!!',
          );
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      // let itemEntryData = new TestBillDetailsEntity(createTestBillItemDto);
      return await this.entityManager.transaction(async (eManager) => {
        let checkIsCancelled = await eManager.findOne(BillMasterEntity, {
          where: {
            id: id,
            status: true,
          },
        });

        if (checkIsCancelled.isCancelled === true)
          throw new InternalServerErrorException(
            'This bill is already cancelled',
          );

        let updateMasterData = await eManager.update(
          BillMasterEntity,
          { id: id },
          {
            isCancelled: true,
            updatedDate: new Date(),
          },
        );

        if (updateMasterData.affected === 0)
          throw new InternalServerErrorException('Error updating lab bill.');

        //here new value is being inserted to details
        const detailsResult = await eManager.update(
          BillDetailEntity,
          { billId: id },
          {
            isCancelled: true,
            updatedDate: new Date(),
          },
        );
        if (detailsResult.affected === 0)
          throw new InternalServerErrorException(
            'Failed product details cancellation.',
          );
        //#end region

        if (detailsResult.affected > 0)
          return { message: 'Test bill cancelled for client.' };
        else
          throw new InternalServerErrorException(
            'Failed to save bill/details!!',
          );
      });
    } catch (error) {
      throw error;
    }
  }
}
