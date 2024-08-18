import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleModule } from 'src/role/role.module';
import { FilesModule } from 'src/files/files.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FilesService } from 'src/files/files.service';
import { RoleEntity } from 'src/role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RoleModule, FilesModule, NestjsFormDataModule],
  controllers: [UsersController],
  providers: [UserService, FilesService],
  exports: [UserService]
})
export class UsersModule {}
