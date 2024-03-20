import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAndDeleteTaskAssignmentDto {
  @IsUUID()
  @IsNotEmpty()
  userId_assigned_to: string;
}

export default CreateAndDeleteTaskAssignmentDto;
