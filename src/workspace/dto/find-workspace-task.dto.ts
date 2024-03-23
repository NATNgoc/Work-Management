import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsString,
  IsBoolean,
  IsEnum,
  IsDateString,
  IsBooleanString,
} from 'class-validator';
import TaskStatus from 'src/enum/task-status.enum';
import { FindUserTaskDto } from 'src/users/dto/find-user-task.dto';

export class FindWorkspaceTaskDto {
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
