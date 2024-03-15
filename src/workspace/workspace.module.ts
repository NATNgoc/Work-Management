import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { ConfigModule } from '@nestjs/config';
import { SystemparamsService } from 'src/systemparams/systemparams.service';
import { SystemparamsModule } from 'src/systemparams/systemparams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMemberService } from './workspace-member.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule,
    SystemparamsModule,
    TypeOrmModule.forFeature([WorkspaceMember, Workspace]),
    UsersModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceMemberService],
})
export class WorkspaceModule {}
