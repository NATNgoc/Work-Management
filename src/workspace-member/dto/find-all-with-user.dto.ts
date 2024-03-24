import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
} from 'class-validator';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';
import WorkspaceType from 'src/enum/workspace-type.enum';

export class FindAllWithUserDto {
  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  startDate: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  endDate: Date;

  @IsEnum(WorkspaceMemberRole)
  @ApiProperty({ required: false })
  role: WorkspaceMemberRole;

  @IsString()
  @ApiProperty({ required: false })
  search: string;

  @IsEnum(WorkspaceType)
  @ApiProperty({ required: false })
  type: WorkspaceType;
}
