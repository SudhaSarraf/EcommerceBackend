import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateCompanyInfoDto,
  UpdateCompanyInfoDto,
} from './dto/company-info.dto';
import { EntityManager } from 'typeorm';
import { CompanyInfoEntity } from './entities/company-info.entity';
import { EntityNotFoundException } from 'src/common/errors/entityNotFoundException';

@Injectable()
export class CompnayInfoService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(
    createCompnayInfoDto: CreateCompanyInfoDto,
    imageFileName?: string,
  ) {
    try {
      let company = new CompanyInfoEntity(createCompnayInfoDto);
      company.logo = imageFileName;
      company.status = true;
      company.inService = true;
      let companyData = await this.entityManager.save(company);
      if (companyData) return companyData;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      let result = await this.entityManager.find(CompanyInfoEntity, {
        order: {
          id: 'DESC',
        },
      });
      if (result.length > 0) return result;
      else throw new EntityNotFoundException();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      let result = await this.entityManager.findOne(CompanyInfoEntity, {
        where: {
          id: id,
          status: true,
        },
      });
      if (result) return result;
      else throw new EntityNotFoundException('Cannot find company');
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateCompnayInfoDto: UpdateCompanyInfoDto  ,
    image?: string,
  ) {
    console.log('Dto received', updateCompnayInfoDto);
    const updateEntity = new CompanyInfoEntity(updateCompnayInfoDto);
    console.log('update entity', updateEntity);
    return await this.entityManager.update(CompanyInfoEntity, id, {
      name: updateEntity.name,
      logo: image,
      regNo: updateEntity.regNo,
      mobile: updateEntity.mobile,
      email: updateEntity.email,
      address: updateEntity.address,
      city: updateEntity.city,
      state: updateEntity.state,
      country: updateEntity.country,
      websiteLink: updateEntity.websiteLink,
      estdDate: updateEntity.estdDate,
    });
  }
}
