import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import TokenPayload from 'src/authentication/key.payload';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UsersService,
		private readonly configServicde: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configServicde.get<string>('SECRET_KEY'),
		});
	}

	async validate(payload: TokenPayload): Promise<User> {
		return await this.userService.findById(payload.user_id)
	}
}