import { Module } from '@nestjs/common';
import { CompnayInfoService } from './company-info.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyInfoEntity } from './entities/company-info.entity';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';
import { CompanyInfoController } from './company-info.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyInfoEntity]), FilesModule],
  controllers: [CompanyInfoController],
  providers: [CompnayInfoService, FilesService],
})
export class CompnayInfoModule {}
