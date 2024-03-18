import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { WorkspaceInvitationStatus } from '../enitities/workspace-invitation.entity';

export class UpdateWorkspaceInvitationDto {
  @IsUUID()
  @IsNotEmpty()
  invitingUserId: string;

  @IsEnum(WorkspaceInvitationStatus)
  @IsNotEmpty()
  status: WorkspaceInvitationStatus;
}
export default UpdateWorkspaceInvitationDto;
