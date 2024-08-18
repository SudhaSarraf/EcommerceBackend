import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import {
  CreateCompanyInfoDto,
  UpdateCompanyInfoDto,
} from './dto/company-info.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';
import { CompnayInfoService } from './company-info.service';

@Controller('company-info')
export class CompanyInfoController {
  constructor(
    private readonly companyInfoService: CompnayInfoService,
    private readonly fileService: FilesService,
  ) {}

  @UseInterceptors(FileInterceptor('logo'))
  @Post('create')
  async create(
    @Body() createCompanyInfoDto: CreateCompanyInfoDto,
    @UploadedFile() logo: Buffer,
  ) {
    if (logo) {
      const imageFileName = await this.fileService.processFile(logo);
      return await this.companyInfoService.create(
        createCompanyInfoDto,
        imageFileName,
      );
    } else {
      return await this.companyInfoService.create(createCompanyInfoDto);
    }
  }

  @Get('getAll')
  findAll() {
    return this.companyInfoService.findAll();
  }

  @Get('getById/:id')
  findOne(@Param('id') id: number) {
    return this.companyInfoService.findOne(+id);
  }

  @UseInterceptors(FileInterceptor('logo'))
  @Patch('update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateCompanyInfoDto: UpdateCompanyInfoDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    const findCompany = await this.companyInfoService.findOne(+id);
    if (!findCompany) throw new HttpException('record not found', 400);

    if (logo && findCompany.logo) {
      //user is updating the existing image, we will overwrite existing file on the server, keeping same name.
      const imageFileName = await this.fileService.processFile(
        logo,
        findCompany.logo,
      );
      return await this.companyInfoService.update(
        id,
        updateCompanyInfoDto,
        imageFileName,
      );
    } else if (logo) {
      //user is providing a new image file for the first time
      const imageFileName = await this.fileService.processFile(logo);
      return await this.companyInfoService.update(
        id,
        updateCompanyInfoDto,
        imageFileName,
      );
    } else {
      return await this.companyInfoService.update(id, updateCompanyInfoDto);
    }
  }
}
