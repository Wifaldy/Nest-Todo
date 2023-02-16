/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as argon from 'argon2'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: id
      }
    });
    if (!user) {
      throw new HttpException('User not found', 404)
    }
    user.email = updateUserDto.email || user.email;
    user.name = updateUserDto.name || user.name;
    user.password = await argon.hash(updateUserDto.password) || user.password;
    user.updated_at = new Date();

    await this.userRepository.save(user);
    delete user.password;
    return {
      user
    };
  }

}
