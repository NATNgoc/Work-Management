import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import TokenPayload from 'src/authentication/key.payload';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from '../authentication.service';
import { Request } from 'express';
import { SessionService } from '../session.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload): Promise<User> {
    if (!(await this.sessionService.findById(payload.session_id))) {
      throw new UnauthorizedException();
    }
    throw new UnauthorizedException();
  }
}
