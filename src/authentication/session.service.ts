import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { ConfigKey } from 'src/common/constaints';
import { Transactional } from 'typeorm-transactional';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-store';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class SessionService {
  redisStore: RedisStore;
  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {
    this.redisStore = cache.store as unknown as RedisStore;
  }

  private timeLimitOfRefreshToken: number = this.configService.get<number>(
    ConfigKey.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  );

  async createNewForUser(sessionId: string, userId: string): Promise<string> {
    const expiredTime = this.timeLimitOfRefreshToken;

    const existingSessions = await new Promise<string[]>((resolve, reject) => {
      this.redisStore.keys(`${userId}:*`, (err, keys) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(keys);
        }
      });
    });

    if (existingSessions.length >= 2) {
      // Lấy TTL cho mỗi key và sắp xếp dựa trên đó
      const sessionsWithTTL = await Promise.all(
        existingSessions.map(
          (key) =>
            new Promise<{ key: string; ttl: number }>((resolve, reject) => {
              this.redisStore.ttl(key, (err, ttl) => {
                if (err) {
                  reject(err);
                } else {
                  resolve({ key, ttl });
                }
              });
            }),
        ),
      );

      // Sắp xếp các session dựa trên TTL từ thấp nhất đến cao nhất
      sessionsWithTTL.sort((a, b) => a.ttl - b.ttl);
      const sessionToBeDeleted = sessionsWithTTL[0].key;
      await this.redisStore.del(sessionToBeDeleted);
    }

    const result = await new Promise<string>((resolve, reject) => {
      this.redisStore.set(
        `${userId}:${sessionId}`,
        true,
        { ttl: expiredTime },
        (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });

    return result;
  }

  async checkExistById(id: string, userId: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      this.redisStore.get(`${userId}:${id}`, {}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
