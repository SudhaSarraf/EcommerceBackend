import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {}
