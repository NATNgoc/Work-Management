import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import RegisterDto, { SignUpDto } from './dto/sign-up.authentication.dto';
import * as argon2 from "argon2";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { KeyService } from './key.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly keyService: KeyService
  ) {}
 
  public async signUp(registrationData: SignUpDto) {
    const hashedPassword: string = await argon2.hash(registrationData.password);
    return await this.usersService.createNew({
      ...registrationData,
      password: hashedPassword,
    });
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
      const user = await this.usersService.checkExistsByEmail(email);
      if (!user) {
          throw new UnauthorizedException
      }
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    
  }
   
  public async checkIfRefreshMatched(userId, refreshToken): Promise<boolean> {
      const user = await this.keyService.findWithUserId(userId)
      if (!user) {
        throw new UnauthorizedException
      }
      await this.verifyPassword(refreshToken, user.refresh_token);
      return true
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await argon2.verify(
      hashedPassword,
      plainTextPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

}
