import { IsUUID, Length, IsEnum } from 'class-validator';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';

export class UpdateRoleMember {
  @IsUUID()
  @Length(8, 60)
  userId: string;
  @IsEnum(WorkspaceMemberRole)
  role: WorkspaceMemberRole;
}
