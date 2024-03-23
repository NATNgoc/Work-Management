import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID, IsDate, IsDateString } from 'class-validator';

export class FindTaskAssignmentDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsUUID()
  userIdAssignedTo?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsUUID()
  userIdAssignedBy?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsDateString()
  endDate?: Date;
}
