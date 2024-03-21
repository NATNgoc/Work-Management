import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import SignUpDto from './dto/sign-up.authentication.dto';
import { LocalAuthGuards } from './guards/local.guards';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { KeyService } from './key.service';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { User } from 'src/users/entities/users.entity';
import { randomUUID } from 'crypto';
import { SessionService } from './session.service';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from 'src/mail/mail.service';

@Controller('auth')
@ApiTags('Authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly keyService: KeyService,
    private readonly sessionService: SessionService,
    private readonly mailService: MailService,
  ) {}

  @HttpCode(200)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<User | null> {
    const user = await this.authenticationService.signUp(signUpDto);
    this.mailService.sendEmail(
      user,
      'Đăng ký thành công',
      '<b>Đăng ký thành công, hãy quay lại và đăng nhập bằng tài khoản mật khẩu</b>',
    );
    return user;
  }

  @UseGuards(LocalAuthGuards)
  @Post('login')
  async login(@Req() req: Request) {
    return await this.authenticationService.login(req.user.id);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    return await this.authenticationService.refreshToken(req.user.id);
  }
}
