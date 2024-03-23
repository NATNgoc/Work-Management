import { Module, forwardRef } from '@nestjs/common';
import { TaskAssignmentService } from './task-assignment.service';
import { TaskAssignmentController } from './task-assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskAssignment } from './entities/task-assignment.entity';
import { UsersModule } from 'src/users/users.module';
import { TaskModule } from 'src/task/task.module';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { WorkspaceMemberModule } from 'src/workspace-member/workspace-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskAssignment]),
    forwardRef(() => TaskModule),
    WorkspaceMemberModule,
  ],
  controllers: [TaskAssignmentController],
  providers: [TaskAssignmentService],
  exports: [TaskAssignmentService],
})
export class TaskAssignmentModule {}
