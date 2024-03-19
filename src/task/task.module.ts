import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

import { WorkspaceModule } from 'src/workspace/workspace.module';
import { WorkspaceMemberModule } from 'src/workspace-member/workspace-member.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), WorkspaceMemberModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
