import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { ConfigModule } from '@nestjs/config';
import { SystemparamsService } from 'src/systemparams/systemparams.service';
import { SystemparamsModule } from 'src/systemparams/systemparams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMemberService } from './workspace-member.service';
import { UsersModule } from 'src/users/users.module';
import { WorkspaceService } from './workspace.service';
import { WorkspaceInvitationService } from './workspace-invitation.service';
import { WorkspaceInvitation } from './entities/workspace-invitation.entity';

@Module({
  imports: [
    ConfigModule,
    SystemparamsModule,
    TypeOrmModule.forFeature([WorkspaceMember, Workspace, WorkspaceInvitation]),
    UsersModule,
  ],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceMemberService,
    WorkspaceInvitationService,
  ],
})
export class WorkspaceModule {}
