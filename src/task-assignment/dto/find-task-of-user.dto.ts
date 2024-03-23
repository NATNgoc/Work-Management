import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsUUID,
  IsDate,
  IsDateString,
  IsBooleanString,
  IsEnum,
  IsString,
} from 'class-validator';
import TaskStatus from 'src/enum/task-status.enum';

export enum TaskType {
  creator = 'creator',
  assignee = 'assignee',
}

export class FindTaskAssignmentOfUserDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsUUID()
  workspace_id?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsBooleanString()
  isDone?: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  search?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsDateString()
  dueDate?: Date;

  @IsEnum(TaskType)
  @IsOptional()
  @ApiProperty({ required: false })
  taskType: TaskType;
}
