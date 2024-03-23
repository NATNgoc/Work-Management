import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDate,
  IsDateString,
} from 'class-validator';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';

export class FindAllUserWorkSpaceDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  search: string;

  @IsEnum(WorkspaceMemberRole)
  @IsOptional()
  @ApiProperty({ required: false })
  type: string;

  @IsDateString()
  @ApiProperty({ required: false })
  @IsOptional()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  endDate: Date;
}
