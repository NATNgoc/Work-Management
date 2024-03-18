import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAndDeleteWorkspaceInvitationDto {
  @IsUUID()
  @IsNotEmpty()
  invitedUserId: string;
}
export default CreateAndDeleteWorkspaceInvitationDto;
