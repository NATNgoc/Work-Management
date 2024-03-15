import { IsEnum, IsUUID } from 'class-validator';
import { WorkspaceMemberRole } from '../entities/workspace-member.entity';

export class CreateWorkspaceMemberDto {
  @IsUUID()
  workspaceId: string;

  @IsUUID()
  userId: string;

  @IsEnum(WorkspaceMemberRole)
  role: WorkspaceMemberRole;
}
