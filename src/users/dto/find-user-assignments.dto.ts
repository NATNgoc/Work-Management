import { IsOptional, IsUUID, IsEnum, IsDate, IsBoolean } from 'class-validator';
import WorkspaceInvitationStatus from 'src/enum/workspace-invitation-status.enum';

export class FindUserAssignmentsDto {
  @IsBoolean()
  @IsOptional()
  isForward: boolean;

  @IsOptional()
  @IsEnum(WorkspaceInvitationStatus)
  status: WorkspaceInvitationStatus;

  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;
}
