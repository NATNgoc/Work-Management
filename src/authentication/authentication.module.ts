import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './stragegies/local.stragegy';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessTokenStrategy } from './stragegies/jwt-access-token.stragegy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { KeyService } from './key.service';
import { JwtRefreshTokenStrategy } from './stragegies/jwt-refresh-token.stragegy';
import { User } from 'src/users/entities/users.entity';

@Module({
  imports: 
  [
    UsersModule, 
    ConfigModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([RefreshToken,User]),
    PassportModule
  ],
  controllers: [AuthenticationController],
  providers: 
  [
    AuthenticationService, 
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    KeyService,
  ],
  exports: []
})
export class AuthenticationModule { }
