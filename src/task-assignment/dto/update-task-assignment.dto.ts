import { PartialType } from '@nestjs/mapped-types';
import { CreateAndDeleteTaskAssignmentDto } from './create-task-assignment.dto';

export class UpdateTaskAssignmentDto extends PartialType(
  CreateAndDeleteTaskAssignmentDto,
) {}
