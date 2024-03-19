import { IsUUID, Length, IsEnum } from 'class-validator';
import { WorkspaceMemberRole } from '../entities/workspace-member.entity';

export class UpdateRoleMember {
  @IsUUID()
  @Length(8, 60)
  userId: string;
  @IsEnum(WorkspaceMemberRole)
  role: WorkspaceMemberRole;
}
