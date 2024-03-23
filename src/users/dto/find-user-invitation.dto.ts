import { boolean } from '@hapi/joi';
import { ParseBoolPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

import {
  IsOptional,
  IsUUID,
  IsEnum,
  IsDate,
  IsBoolean,
  IsIn,
  IsDateString,
  IsBooleanString,
} from 'class-validator';
import WorkspaceInvitationStatus from 'src/enum/workspace-invitation-status.enum';

export class FindUserWorkspaceInvitationsDto {
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
  @ApiProperty({ required: false })
  @IsOptional()
  startDate: Date;

  @IsDateString()
  @ApiProperty({ required: false })
  @IsOptional()
  endDate: Date;
}
