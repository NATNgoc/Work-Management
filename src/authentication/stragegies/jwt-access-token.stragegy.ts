import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import TokenPayload from 'src/authentication/key.payload';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { SessionService } from '../session.service';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly configServicde: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configServicde.get<string>('SECRET_KEY'),
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    if (!(await this.sessionService.findById(payload.session_id))) {
      throw new UnauthorizedException('Session is out');
    }
    const user = await this.userService.findById(payload.user_id);
    if (!user) {
      throw new NotFoundException("User isn't existing");
    }
    return user;
  }
}
