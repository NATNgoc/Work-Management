import { Type } from 'class-transformer';
import { IsOptional, IsUUID, IsEnum, IsDate } from 'class-validator';
import WorkspaceInvitationStatus from 'src/enum/workspace-invitation-status.enum';

export class FindWorkspaceInvitationsDto {
  @IsOptional()
  @IsUUID()
  workspaceId?: string;

  @IsOptional()
  @IsUUID()
  invitingUserId?: string;

  @IsOptional()
  @IsUUID()
  invitedUserId?: string;

  @IsOptional()
  @IsEnum(WorkspaceInvitationStatus)
  status?: WorkspaceInvitationStatus;

  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;
}
