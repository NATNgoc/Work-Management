import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { WorkspaceInvitationStatus } from '../../enum/workspace-invitation-status.enum';

export class UpdateWorkspaceInvitationDto {
  @IsUUID()
  @IsNotEmpty()
  invitingUserId: string;

  @IsEnum(WorkspaceInvitationStatus)
  @IsNotEmpty()
  status: WorkspaceInvitationStatus;
}
export default UpdateWorkspaceInvitationDto;
