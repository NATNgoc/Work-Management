import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import {
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import TaskStatus from 'src/enum/task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;
}
export default UpdateTaskStatusDto;
