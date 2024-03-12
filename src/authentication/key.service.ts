import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './key.payload';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import * as argon2 from "argon2";
@Injectable()
export class KeyService {
    constructor(
        private readonly jwtService : JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
    ) {}

    async generateAccessToken(payload: TokenPayload) {
        return this.jwtService.sign(payload,{
            secret: `${this.configService.get<number>('SECRET_KEY')}`,
            expiresIn: `${this.configService.get<string>(
                'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
            )}s`
    })
    }

    async findWithUserId(userId: string) {
        return this.refreshTokenRepository.findOne({
          where: {user_id: userId}
        })
    }

    async storeRefreshToken(userId: string, refreshToken: string) {
        try {
          const existingToken = await this.refreshTokenRepository.findOne({ where: {user_id: userId} });
    
          if (existingToken) {
            return await this.storeRefreshTokenWhenTokenExsiting(existingToken, refreshToken)
          } 
          
          await this.storeRefreshTokenWhenTokenNotExsits(refreshToken, userId)
          
        } catch (error) {
          throw error;
        }
      }

    private async storeRefreshTokenWhenTokenExsiting(existingToken: RefreshToken,refreshToken: string) {
        const hashedToken = await argon2.hash(refreshToken);
        existingToken.refresh_token = hashedToken;
        await this.refreshTokenRepository.save(existingToken);
      }

    private  async storeRefreshTokenWhenTokenNotExsits(refreshToken: string, userId: string) {
      const hashedToken = await argon2.hash(refreshToken);
          const newToken = this.refreshTokenRepository.create({ user_id: userId, refresh_token: hashedToken });
          await this.refreshTokenRepository.save(newToken);
    }

    async generateRefreshToken(payload: TokenPayload) {
        return this.jwtService.sign(payload,{
            secret: `${this.configService.get<number>('REFRESH_TOKEN_KEY')}`,
            expiresIn: `${this.configService.get<string>(
                'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
            )}s`
    })
    }
}
