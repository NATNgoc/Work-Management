import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsDate,
  IsBoolean,
  IsDateString,
  IsBooleanString,
} from 'class-validator';
import WorkspaceInvitationStatus from 'src/enum/workspace-invitation-status.enum';

export class FindUserAssignmentsDto {
  @IsBoolean()
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isForward: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsEnum(WorkspaceInvitationStatus)
  status: WorkspaceInvitationStatus;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  startDate: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  endDate: Date;
}
