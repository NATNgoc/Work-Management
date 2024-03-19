import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserGeneralDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { AuthenticationService } from 'src/authentication/authentication.service';
import * as argon2 from 'argon2';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly authService: AuthenticationService,
  ) {}

  async updateGeneralInformation(
    userId: string,
    updateData: UpdateUserGeneralDto,
  ): Promise<UpdateResult> {
    const user = await this.userRepository.update(userId, {
      ...updateData,
    });
    return user;
  }

  async changePassword(
    user: User,
    oldPass: string,
    newPass: string,
  ): Promise<User | null> {
    await this.authService.verifyPassword(oldPass, user.password);
    user.password = await argon2.hash(newPass);
    await this.userRepository.save(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async checkExistsByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async checkExistsById(id: string): Promise<Boolean | null> {
    const result = await this.userRepository.findOne({
      where: { id: id },
      select: { id: true },
    });
    return result != null ? true : false;
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
