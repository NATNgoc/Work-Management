import { IsEnum, IsUUID } from 'class-validator';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';

export class CreateWorkspaceMemberDto {
  @IsUUID()
  workspaceId: string;

  @IsUUID()
  userId: string;

  @IsEnum(WorkspaceMemberRole)
  role: WorkspaceMemberRole;
}
