import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { WorkspaceMemberController } from './workspace-member.controller';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceMember]),
    forwardRef(() => WorkspaceModule),
    UsersModule,
  ],
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService],
  exports: [WorkspaceMemberService],
})
export class WorkspaceMemberModule {}
