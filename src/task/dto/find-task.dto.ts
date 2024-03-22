import { Type } from 'class-transformer';
import {
  IsOptional,
  IsUUID,
  IsString,
  IsBoolean,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Task } from '../entities/task.entity';
import TaskStatus from 'src/enum/task-status.enum';

export class FindUserTaskDto {
  @IsOptional()
  @IsUUID()
  workspace_id?: string;

  @IsOptional()
  @IsUUID()
  created_by?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  isDone?: boolean;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;
}
