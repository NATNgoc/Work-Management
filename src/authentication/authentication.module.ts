import { Module, forwardRef } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './stragegies/local.stragegy';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessTokenStrategy } from './stragegies/jwt-access-token.stragegy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyService } from './key.service';
import { JwtRefreshTokenStrategy } from './stragegies/jwt-refresh-token.stragegy';
import { User } from 'src/users/entities/users.entity';
import { SessionService } from './session.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    MailModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    KeyService,
    SessionService,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
