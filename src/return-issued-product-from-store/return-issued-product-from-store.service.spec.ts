import { Test, TestingModule } from '@nestjs/testing';
import { ReturnIssuedProductFromStoreService } from './return-issued-product-from-store.service';

describe('ReturnIssuedProductFromStoreService', () => {
  let service: ReturnIssuedProductFromStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturnIssuedProductFromStoreService],
    }).compile();

    service = module.get<ReturnIssuedProductFromStoreService>(ReturnIssuedProductFromStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
