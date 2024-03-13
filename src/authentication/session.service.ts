import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { ConfigKey } from 'src/common/constaints';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private readonly configService: ConfigService,
  ) {}

  private timeLimitOfRefreshToken: number = this.configService.get<number>(
    ConfigKey.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  );

  async createNewForUser(
    sessionId: string,
    userId: string,
  ): Promise<Session | null> {
    const expiredTime = dayjs()
      .add(this.timeLimitOfRefreshToken, 'second')
      .toDate();

    const existingSessions = await this.sessionRepository.find({
      where: { userId: userId },
      order: { expiredAt: 'ASC' },
    });

    if (existingSessions.length >= 2) {
      await this.sessionRepository.delete(existingSessions[0].id);
    }

    const session = this.sessionRepository.create({
      id: sessionId,
      expiredAt: expiredTime,
      userId: userId,
    });

    if (session) {
      throw new InternalServerErrorException();
    }

    return session;
  }

  async findById(id: string): Promise<Session | null> {
    return this.sessionRepository.findOneBy({ id });
  }
}
