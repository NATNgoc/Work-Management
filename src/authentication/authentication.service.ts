import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.authentication.dto';
import * as argon2 from 'argon2';
import { KeyService } from './key.service';
import { User } from 'src/users/entities/users.entity';
import { v4 as uuidv4 } from 'uuid';
import { SessionService } from './session.service';
@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly keyService: KeyService,
    private readonly sessionService: SessionService,
  ) {}

  public async genNewPairToken(
    userId: string,
    sessionId: string,
  ): Promise<[string, string] | null> {
    const [accessToken, refreshToken] = await Promise.all([
      this.keyService.generateAccessToken({
        user_id: userId,
        session_id: sessionId,
      }),
      this.keyService.generateRefreshToken({
        user_id: userId,
        session_id: sessionId,
      }), // Sử dụng phương thức phù hợp để tạo refreshToken
    ]);
    return [accessToken, refreshToken];
  }

  public async signUp(registrationData: SignUpDto): Promise<User | null> {
    const hashedPassword: string = await argon2.hash(registrationData.password);
    return await this.usersService.createNew({
      ...registrationData,
      password: hashedPassword,
    });
  }

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<User | null> {
    const user = await this.usersService.checkExistsByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    await this.verifyPassword(plainTextPassword, user.password);
    return user;
  }

  async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatching: boolean = await argon2.verify(
      hashedPassword,
      plainTextPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
