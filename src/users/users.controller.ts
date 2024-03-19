import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessTokenGuard } from 'src/authentication/guards/jwt-access-token.guard';
import { UsersService } from './users.service';
import { UpdateUserGeneralDto } from './dto/update-user.dto';
import { EnsureUserOwnership } from 'src/decorators/ensurance-user-ownership.decorator';
import { changePasswordDto } from './dto/change-passwork-user.dto';
import { Request } from 'express';
import { User } from './entities/users.entity';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('')
  @UseGuards(JwtAccessTokenGuard)
  async findAll() {
    return 'get all';
  }

  @Patch(':id/password')
  @UseGuards(JwtAccessTokenGuard)
  async changePassword(
    @Param()
    @EnsureUserOwnership()
    id: string,
    @Body() changePasswordData: changePasswordDto,
    @Req() req: Request,
  ) {
    const curUser: User = req.user;
    return await this.userService.changePassword(
      curUser,
      changePasswordData.oldPassword,
      changePasswordData.newPassword,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  async updateGeneralInformation(
    @Param()
    @EnsureUserOwnership()
    id: string,
    @Body() updateData: UpdateUserGeneralDto,
  ) {
    return this.userService.updateGeneralInformation(id, updateData);
  }
}
