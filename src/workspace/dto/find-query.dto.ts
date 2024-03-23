import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';

export class FindAllWorkSpaceDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ required: false })
  ownerId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  search: string;

  @IsEnum(WorkspaceMemberRole)
  @IsOptional()
  @ApiProperty({ required: false })
  type: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  startDate: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  endDate: Date;
}

export default FindAllWorkSpaceDto;
