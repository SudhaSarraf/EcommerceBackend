import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AtGuard } from './guards/at.guard';
import { RoleModule } from './role/role.module';
import { dataSourceOtps } from './db/ormconfig';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { OtpModule } from './otp/otp.module';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger.service.ts/logger.module';
import { UsersMiddleware } from './user/users.middleware';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
import { RoleEntity } from './role/entities/role.entity';
import { UserEntity } from './user/entities/user.entity';
import { ProductEntity } from './product/entities/product.entity';
import { CartEntity } from './cart/entities/cart.entity';
import { BillModule } from './orderBill/orderBill.module';
import { BillDetailEntity } from './orderBill/entities/orderBill-detail.entity';
import { BillMasterEntity } from './orderBill/entities/orderBill-master.entity';
import { PurchaseEntryModule } from './purchase-entry/purchase-entry.module';
import { IssuedProductFromStoreModule } from './sales-entry/sales-entry.module';
import { ReturnPurchaseEntryModule } from './return-purchase-entry/return-purchase-entry.module';
import { ReturnIssuedProductFromStoreModule } from './return-issued-product-from-store/return-issued-product-from-store.module';
import { CompnayInfoModule } from './company-info/company-info.module';
import { BrandModule } from './brand/brand.module';
import { UnitModule } from './unit/unit.module';
import { CategoryModule } from './category/category.module';
import { CompanyInfoEntity } from './company-info/entities/company-info.entity';
import { CategoryEntity } from './category/entities/category.entity';
import { BrandEntity } from './brand/entities/brand.entity';
import { UnitEntity } from './unit/entities/unit.entity';
import { InventoryModule } from './inventory/inventory.module';
import { InventoryEntity } from './inventory/entities/inventory.entity';
import { OrderMainModule } from './order-main/order-main.module';
import { OrderMain } from './order-main/entities/order-main.entity';
import { WishlistModule } from './wishlist/wishlist.module';
import { WishlistEntity } from './wishlist/entities/wishlist.entity';
import { SalesEntryMasterEntity } from './sales-entry/entities/sales-entry-master.entity';
import { SalesEntryDetailEntity } from './sales-entry/entities/sales-entry-details.entity';
import { PurchaseEntryMasterEntity } from './purchase-entry/entities/productPurchaseEntryMaster.entity';
import { PurchaseEntryDetailEntity } from './purchase-entry/entities/productPurchaseEntryDetails.entity';
import { PurchaseReturnEntryMasterEntity } from './return-purchase-entry/entities/purchaseReturnEntryMaster.entity';
import { PurchaseReturnEntryDetailsEntity } from './return-purchase-entry/entities/purchaseReturnEntryDetails.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    NestjsFormDataModule,
    // ServeStaticModule.forRoot({
    //   rootPath: path.resolve(__dirname, 'files/static')
    // }),
    ServeStaticModule.forRootAsync({
      useFactory: () => {
        const uploadsPath = path.join(__dirname, 'files/static');
        return [
          {
            rootPath: uploadsPath,
            // serveRoot: '/static/',
            serveStaticOptions: {
              index: false,
            },
          },
        ];
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...dataSourceOtps,
        // autoLoadEntities: true,
        entities: [
          ProductEntity,
          OrderMain,
          CartEntity,
          RoleEntity,
          UserEntity,
          BillDetailEntity,
          BillMasterEntity,
          CompanyInfoEntity,
          CategoryEntity,
          BrandEntity,
          UnitEntity,
          InventoryEntity,
          WishlistEntity,
          PurchaseEntryMasterEntity,
          PurchaseEntryDetailEntity,
          PurchaseReturnEntryMasterEntity,
          PurchaseReturnEntryDetailsEntity,
          SalesEntryMasterEntity,
          SalesEntryDetailEntity,
        ],
      }),
      inject: [ConfigService], // Explicitly inject ConfigService
    }),
    PassportModule,
    UsersModule,
    AuthModule,
    LoggerModule,
    RoleModule,
    FilesModule,
    OtpModule,
    CartModule,
    ProductModule,
    BillModule,
    PurchaseEntryModule,
    IssuedProductFromStoreModule,
    ReturnPurchaseEntryModule,
    ReturnIssuedProductFromStoreModule,
    CategoryModule,
    BrandModule,
    UnitModule,
    CompnayInfoModule,
    InventoryModule,
    OrderMainModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

// export class AppModule{}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsersMiddleware)
      .forRoutes({ path: 'users/signup', method: RequestMethod.ALL });
  }
}
