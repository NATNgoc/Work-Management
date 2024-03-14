import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SystemParameter } from './entities/systemparam.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SystemparamsService {
  constructor(
    @InjectRepository(SystemParameter)
    private readonly systemParamsRepository: Repository<SystemParameter>,
  ) {}

  async getValueByKey(key: string): Promise<number | null> {
    const systemParams: SystemParameter =
      await this.systemParamsRepository.findOneBy({
        id: key,
      });
    if (!systemParams) {
      throw new InternalServerErrorException(`Missing workspace ${key}`);
    }
    return systemParams.value.value as number;
  }
}
