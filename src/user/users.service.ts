import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdatePasswordDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { EntityManager, UpdateResult } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { SuccessReturn } from 'src/common/success/successReturn';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UserService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly filesService: FilesService,
  ) {}

  async create(userData: Partial<UserEntity>) {
    return await this.entityManager.save(UserEntity, userData);
  }

  async findAll() {
    const users = await this.entityManager.find(UserEntity, {
      select: {
        active: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        houseNoAreaStreet: true,
        landmark: true,
        state: true,
        cityTown: true,
        pinCode: true,
        roles: true,
        image: true,
      },
      relations: ['roles'],
    });
    if (users) {
      // if a user were not found, we want to strip password and hashedRt from resulting users array
      const foundUsers = users.map((u) => {
        const { password, hashedRt, ...rest } = u;
        return rest;
      });
      return foundUsers;
    }
    return users;
  }

  async findOne(id: number) {
    return await this.entityManager.findOne(UserEntity, {
      where: {
        userId: id,
      },
      select: {
        active: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        houseNoAreaStreet: true,
        landmark: true,
        state: true,
        cityTown: true,
        pinCode: true,
        roles: true,
        image: true,
      },
      relations: {
        roles: true,
      },
    });
  }

  async update(id: number, userData: UpdateUserDto) {
    let imageName: string = '';
    // fetch existing user, so that we can get image and overwrite it
    const foundUser = await this.findOne(id);
    if (!foundUser)
      throw new HttpException('user with given userId not found', 400);

    if (userData.image && foundUser.image)
      imageName = await this.filesService.processFile(
        userData.image,
        foundUser.image,
      );
    else if (userData.image) {
      imageName = await this.filesService.processFile(userData.image);
    }

    const updateDto = { ...userData, roles: foundUser.roles };
    const updateEntity = new UserEntity({ ...updateDto, image: imageName });
    let data: UpdateResult;
    if (updateEntity) {
      data = await this.entityManager.update(UserEntity, id, {
        firstName: updateEntity.firstName,
        lastName: updateEntity.lastName,
        image: updateEntity.image || foundUser.image,
        email: updateEntity.email,
        phone: updateEntity.phone,
        houseNoAreaStreet: updateEntity.houseNoAreaStreet,
        landmark: updateEntity.landmark,
        state: updateEntity.state,
        cityTown: updateEntity.cityTown,
        pinCode: updateEntity.pinCode,
      });
    } else throw new InternalServerErrorException('Error while updating user.');

    if (data.affected > 0) return this.findOne(id);
    else throw new InternalServerErrorException('Error while updating user.');
  }

  async updatePassword(id: number, userData: UpdatePasswordDto) {
    try {
      const foundUser = await this.entityManager.find(UserEntity, {
        where: {
          userId: id,
        },
        select: {
          password: true,
        },
      });
      console.log('foundUser', foundUser);
      if (foundUser.length <= 0)
        throw new HttpException('user with given userId not found', 400);
      console.log('found user password ', foundUser, foundUser[0].password);

      const encPass = foundUser[0].password;

      const isMatched = await bcrypt.compare(userData.oldPassword, encPass);
      if (!isMatched)
        throw new InternalServerErrorException('Password not matched');

      if (!userData.newPassword)
        throw new InternalServerErrorException('New Password not found');
      const hashedPassword = await bcrypt.hash(userData.newPassword, 10);
      if (!hashedPassword)
        throw new InternalServerErrorException('error while hashing password');

      let data: UpdateResult;
      data = await this.entityManager.update(UserEntity, id, {
        password: hashedPassword,
      });

      if (data.affected > 0)
        return SuccessReturn('Password updated successfully.');
      else
        throw new InternalServerErrorException('Error while updating password');
    } catch (error) {
      throw error;
    }
  }

  async updateHashedRt(id: number, rt: string) {
    try {
      const user = await this.findUserById(id);
      if (!user) throw new HttpException('User does not exist', 400);

      user.hashedRt = rt;
      const updatedUser = this.entityManager.save(user);
      return updatedUser;
    } catch (error) {
      return error;
    }
  }

  async findUserId(userId: number) {
    return await this.entityManager.countBy(UserEntity, { userId: userId });
  }

  async findUserById(userId: number) {
    return await this.entityManager.findOne(UserEntity, {
      where: { userId: userId },
      relations: ['roles'],
    });
  }

  public async count(email: string) {
    return await this.entityManager.count(UserEntity, {
      where: {
        email: email,
      },
    });
  }

  public async countAllUser(companyId: number) {
    return await this.entityManager.count(UserEntity, {
      where: {
        companyId: companyId,
      },
    });
  }

  public async findByEmail(email: string) {
    return await this.entityManager.findOne(UserEntity, {
      where: {
        email: email,
      },
      relations: { roles: true },
    });
  }

  async remove(id: number) {
    return await this.entityManager.softRemove(UserEntity, { userId: id });
  }

  async logout(userId: number) {
    const user = await this.findUserById(userId);
    user.hashedRt = null;
    return await this.entityManager.save(user);
  }
}
