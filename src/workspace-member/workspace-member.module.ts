import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { WorkspaceMemberController } from './workspace-member.controller';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceService } from 'src/workspace/workspace.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceMember])],
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService],
  exports: [WorkspaceMemberService],
})
export class WorkspaceMemberModule {}
