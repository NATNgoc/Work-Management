import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTaskAssignmentDto {
  @IsUUID()
  @IsNotEmpty()
  userId_assigned_to: string;
}

export default CreateTaskAssignmentDto;
