import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsDate,
  IsDateString,
} from 'class-validator';
import WorkspaceInvitationStatus from 'src/enum/workspace-invitation-status.enum';

export class FindWorkspaceInvitationsDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsUUID()
  workspaceId?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsUUID()
  invitingUserId?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsUUID()
  invitedUserId?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsEnum(WorkspaceInvitationStatus)
  status?: WorkspaceInvitationStatus;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  startDate: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  endDate: Date;
}
