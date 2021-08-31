import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { CreateUserInterface } from './interfaces/create-user.interface';

@Injectable()
export class UsersService {
  constructor(

    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,

  ) {}

  create(createUserInterface: CreateUserInterface) {
    const userIns = this.usersRepository.create(createUserInterface);
    return this.usersRepository.save(userIns);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
