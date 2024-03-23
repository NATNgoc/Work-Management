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
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MailService } from 'src/mail/mail.service';
import { LoginDto } from './dto/login.authentication.dto';

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
  @ApiBody({
    type: SignUpDto,
  })
  @HttpCode(200)
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed up.',
    type: User,
  })
  @ApiBody({
    type: SignUpDto,
  })
  async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
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
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    type: 'object',
    schema: {
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiBody({
    type: LoginDto,
  })
  async login(
    @Req() req: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authenticationService.login(req.user.id);
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshTokenGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Access token successfully refreshed.',
    type: 'object',
    schema: { properties: { accessToken: { type: 'string' } } },
  })
  @ApiBearerAuth()
  async refreshToken(@Req() req: Request) {
    return await this.authenticationService.refreshToken(req.user.id);
  }
}
