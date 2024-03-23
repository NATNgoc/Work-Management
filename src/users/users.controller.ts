import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from 'src/task/task.service';
import { FindUserTaskDto } from './dto/find-user-task.dto';
import { FindAllUserWorkSpaceDto } from './dto/find-user-workspaces.dto';
import { FindUserWorkspaceInvitationsDto } from './dto/find-user-invitation.dto';
import { UpdateResult } from 'typeorm';
import { WorkspaceInvitation } from 'src/workspace-invitation/enitities/workspace-invitation.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { Task } from 'src/task/entities/task.entity';
import { FindTaskAssignmentOfUserDto } from 'src/task-assignment/dto/find-task-of-user.dto';
import { TaskAssignment } from 'src/task-assignment/entities/task-assignment.entity';
import { FindAllWithUserDto } from 'src/workspace-member/dto/find-all-with-user.dto';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id/tasks')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Find tasks assigned to a user' })
  @ApiResponse({
    status: 200,
    description: 'Return all tasks assigned to the user.',
    type: [Task],
  })
  async findTheirTasks(
    @Param('id') id: string,
    @Query() queryData: FindTaskAssignmentOfUserDto,
  ): Promise<TaskAssignment[] | Task[]> {
    return await this.userService.findUserTasks(queryData, id);
  }

  @Get(':id')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Get user information' })
  @ApiResponse({
    status: 200,
    description: 'Return user information.',
    type: User,
  })
  async getUserInformation(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<User> {
    return req.user;
  }

  @Patch(':id/password')
  @HttpCode(200)
  @ApiBody({ type: changePasswordDto })
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @UseGuards(JwtAccessTokenGuard)
  async changePassword(
    @Body() changePasswordData: changePasswordDto,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    await this.userService.changePassword(
      req.user,
      changePasswordData.oldPassword,
      changePasswordData.newPassword,
    );
    return { message: 'Reset password successfully!' };
  }

  @Get(':id/workspaces')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Find workspaces a user belongs to' })
  @ApiResponse({
    status: 200,
    description: 'Return all workspaces the user belongs to.',
    type: [Workspace],
  })
  async findTheirWorkspaces(
    @Param('id') id: string,
    @Query() queryData: FindAllWithUserDto,
    @Req() req: Request,
  ): Promise<Workspace[] | WorkspaceMember[]> {
    return await this.userService.findUserWorkspaces(queryData, req.user);
  }

  @Get(':id/invitations')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({ summary: 'Find workspace invitations for a user' })
  @ApiResponse({
    status: 200,
    description: 'Return all workspace invitations for the user.',
    type: [WorkspaceInvitation],
  })
  async findTheirInvitations(
    @Param('id')
    @EnsureUserOwnership()
    id: string,
    @Query()
    queryData: FindUserWorkspaceInvitationsDto,
    @Req() req: Request,
  ): Promise<WorkspaceInvitation[]> {
    return await this.userService.findUserInvitations(queryData, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update general information of a user' })
  @ApiResponse({
    status: 200,
    description: 'User information updated successfully.',
    type: UpdateResult,
  })
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
