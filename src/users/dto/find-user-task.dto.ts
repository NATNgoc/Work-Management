import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsUUID,
  IsString,
  IsBoolean,
  IsEnum,
  IsDate,
  IsDateString,
  IsBooleanString,
} from 'class-validator';
import TaskStatus from 'src/enum/task-status.enum';

export class FindUserTaskDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsUUID()
  workspace_id?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  search?: string;

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({ required: false })
  isDone?: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsDateString()
  dueDate?: Date;
}
