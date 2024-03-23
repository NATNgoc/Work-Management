import { Transform, Type } from 'class-transformer';
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
import { Task } from '../entities/task.entity';
import TaskStatus from 'src/enum/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';

export class FindUserTaskDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsUUID()
  workspace_id?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsUUID()
  created_by?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  search?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsBooleanString()
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
