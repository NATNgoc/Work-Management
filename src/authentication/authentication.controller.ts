import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import SignUpDto from './dto/sign-up.authentication.dto';
import { LocalAuthGuards } from './guards/local.guards';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { KeyService } from './key.service';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { User } from 'src/users/entities/users.entity';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly keyService: KeyService
    ) {}



  @HttpCode(200)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<User|null> {
    return this.authenticationService.signUp(signUpDto)
  }

  @UseGuards(LocalAuthGuards)
  @Post('login')
  async login(@Req() req: Request) {
    const [accessToken, refreshToken] = await Promise.all([
      this.keyService.generateAccessToken({user_id: req.user.id}),
      this.keyService.generateRefreshToken({user_id: req.user.id}) // Sử dụng phương thức phù hợp để tạo refreshToken
    ]);

    await this.keyService.storeRefreshToken(req.user.id,refreshToken)
    return {
      accessToken,
      refreshToken
    }
  }


  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const [accessToken, refreshToken] = await Promise.all([
      this.keyService.generateAccessToken({user_id: req.user.id}),
      this.keyService.generateRefreshToken({user_id: req.user.id}) // Sử dụng phương thức phù hợp để tạo refreshToken
    ]);
    await this.keyService.storeRefreshToken(req.user.id,refreshToken)
    return {
      accessToken,
      refreshToken
    }
  }
}
