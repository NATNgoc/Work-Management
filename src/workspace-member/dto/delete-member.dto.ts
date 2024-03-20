import { IsUUID, Length, IsEnum } from 'class-validator';

export class DeleteMember {
  @IsUUID()
  @Length(8, 60)
  userId: string;
}

export default DeleteMember;
