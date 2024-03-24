import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import * as dayjs from 'dayjs';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';

export class FindAllMembersDto {
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
}

export default FindAllMembersDto;
