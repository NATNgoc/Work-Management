import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';

export class FindAllMembersDto {
  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsEnum(WorkspaceMemberRole)
  role: WorkspaceMemberRole;
}

export default FindAllMembersDto;
