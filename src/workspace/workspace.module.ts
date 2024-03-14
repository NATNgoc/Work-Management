import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { ConfigModule } from '@nestjs/config';
import { SystemparamsService } from 'src/systemparams/systemparams.service';
import { SystemparamsModule } from 'src/systemparams/systemparams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { Workspace } from './entities/workspace.entity';

@Module({
  imports: [
    ConfigModule,
    SystemparamsModule,
    TypeOrmModule.forFeature([WorkspaceMember, Workspace]),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
