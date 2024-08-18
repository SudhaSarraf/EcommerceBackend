import { PartialType } from '@nestjs/mapped-types';
import { CreateReturnIssuedProductFromStoreDto } from './create-return-issued-product-from-store.dto';

export class UpdateReturnIssuedProductFromStoreDto extends PartialType(CreateReturnIssuedProductFromStoreDto) {}
