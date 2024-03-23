import { Module, UsePipes, ValidationPipe, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { TaskModule } from 'src/task/task.module';
import { WorkspaceMemberModule } from 'src/workspace-member/workspace-member.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { WorkspaceInvitation } from 'src/workspace-invitation/enitities/workspace-invitation.entity';
import { WorkspaceInvitationModule } from 'src/workspace-invitation/workspace-invitation.module';
import { TaskAssignment } from 'src/task-assignment/entities/task-assignment.entity';
import { TaskAssignmentModule } from 'src/task-assignment/task-assignment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthenticationModule),
    TaskModule,
    forwardRef(() => WorkspaceMemberModule),
    forwardRef(() => WorkspaceModule),
    forwardRef(() => WorkspaceInvitationModule),
    TaskAssignmentModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
