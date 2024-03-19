import { Module, forwardRef } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { ConfigModule } from '@nestjs/config';
import { SystemparamsService } from 'src/systemparams/systemparams.service';
import { SystemparamsModule } from 'src/systemparams/systemparams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMemberService } from '../workspace-member/workspace-member.service';
import { UsersModule } from 'src/users/users.module';
import { WorkspaceService } from './workspace.service';
import { WorkspaceInvitationService } from '../workspace-invitation/workspace-invitation.service';
import { WorkspaceInvitation } from '../workspace-invitation/enitities/workspace-invitation.entity';
import { WorkspaceInvitationModule } from 'src/workspace-invitation/workspace-invitation.module';
import { WorkspaceMemberModule } from 'src/workspace-member/workspace-member.module';

@Module({
  imports: [
    ConfigModule,
    SystemparamsModule,
    TypeOrmModule.forFeature([WorkspaceMember, Workspace]),
    UsersModule,
    forwardRef(() => WorkspaceMemberModule),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
