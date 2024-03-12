import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authentication.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthenticationService) {
		super({ usernameField: 'email' }); // Mặc định là username, đổi sang email
	}

	async validate(email: string, password: string) {
		const user = await this.authService.getAuthenticatedUser(email, password);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}