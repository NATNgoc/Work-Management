import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { WorkspaceMemberRole } from '../entities/workspace-member.entity';

export class CreateAndDeleteWorkspaceInvitationDto {
  @IsUUID()
  @IsNotEmpty()
  invitedUserId: string;
}
