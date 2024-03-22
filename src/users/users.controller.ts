import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
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
import { ApiTags } from '@nestjs/swagger';
import { TaskService } from 'src/task/task.service';
import { FindUserTaskDto } from './dto/find-user-task.dto';
import { FindAllUserWorkSpaceDto } from './dto/find-user-workspaces.dto';
import { FindUserWorkspaceInvitationsDto } from './dto/find-user-invitation.dto';
import { UpdateResult } from 'typeorm';
import { WorkspaceInvitation } from 'src/workspace-invitation/enitities/workspace-invitation.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { Task } from 'src/task/entities/task.entity';
@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id/tasks')
  @UseGuards(JwtAccessTokenGuard)
  async findTheirTasks(
    @Param('id')
    @EnsureUserOwnership()
    id: string,
    @Query() queryData: FindUserTaskDto,
  ): Promise<Task[]> {
    return await this.userService.findUserTasks(queryData, id);
  }

  @Get(':id')
  @UseGuards(JwtAccessTokenGuard)
  async getUserInformation(
    @Param('id')
    @EnsureUserOwnership()
    id: string,
    @Req() req: Request,
  ): Promise<User> {
    return req.user;
  }

  @Patch(':id/password')
  @UseGuards(JwtAccessTokenGuard)
  async changePassword(
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

  @Get(':id/workspaces')
  @UseGuards(JwtAccessTokenGuard)
  async findTheirWorkspaces(
    @Param('id')
    @EnsureUserOwnership()
    id: string,
    @Query() queryData: FindAllUserWorkSpaceDto,
    @Req() req: Request,
  ): Promise<Workspace[]> {
    return await this.userService.findUserWorkspaces(queryData, req.user);
  }

  @Get(':id/invitations')
  @UseGuards(JwtAccessTokenGuard)
  async findTheirInvitations(
    @Param('id')
    @EnsureUserOwnership()
    id: string,
    @Query() queryData: FindUserWorkspaceInvitationsDto,
    @Req() req: Request,
  ): Promise<WorkspaceInvitation[]> {
    return await this.userService.findUserInvitations(queryData, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAccessTokenGuard)
  async updateGeneralInformation(
    @Param()
    @EnsureUserOwnership()
    id: string,
    @Body() updateData: UpdateUserGeneralDto,
  ): Promise<UpdateResult> {
    return await this.userService.updateGeneralInformation(id, updateData);
  }
}
