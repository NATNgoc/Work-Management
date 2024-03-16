import {
  BadRequestException,
  ConflictException,
  Injectable,
  Scope,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async checkExistsByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async checkExistsById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async createNew(createUserDto: CreateUserDto): Promise<User> {
    if (await this.checkExistsByEmail(createUserDto.email)) {
      throw new ConflictException();
    }
    const newUser = await this.userRepository.create(createUserDto);
    if (!newUser) {
      throw new BadRequestException();
    }
    await this.userRepository.save(newUser);
    return newUser;
  }
}
