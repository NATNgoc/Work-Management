import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './key.payload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeyService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get<number>('SECRET_KEY')}`,
      expiresIn: `${this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  async generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get<number>('REFRESH_TOKEN_KEY')}`,
      expiresIn: `${this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }
}
