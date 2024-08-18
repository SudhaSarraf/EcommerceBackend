import { Test, TestingModule } from '@nestjs/testing';
import { ReturnIssuedProductFromStoreController } from './return-issued-product-from-store.controller';
import { ReturnIssuedProductFromStoreService } from './return-issued-product-from-store.service';

describe('ReturnIssuedProductFromStoreController', () => {
  let controller: ReturnIssuedProductFromStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturnIssuedProductFromStoreController],
      providers: [ReturnIssuedProductFromStoreService],
    }).compile();

    controller = module.get<ReturnIssuedProductFromStoreController>(ReturnIssuedProductFromStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
