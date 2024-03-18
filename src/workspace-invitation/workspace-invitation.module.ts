import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceInvitation } from 'src/workspace-invitation/enitities/workspace-invitation.entity';
import { WorkspaceInvitationService } from './workspace-invitation.service';
import { WorkspacdeInvitationController } from './workspacde-invitation.controller';
import { UsersModule } from 'src/users/users.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceInvitation]),
    UsersModule,
    WorkspaceModule,
  ],
  providers: [WorkspaceInvitationService],
  controllers: [WorkspacdeInvitationController],
  exports: [WorkspaceInvitationService],
})
export class WorkspaceInvitationModule {}
