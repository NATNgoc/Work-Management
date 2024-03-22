import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDate,
} from 'class-validator';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';

export class FindAllUserWorkSpaceDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsEnum(WorkspaceMemberRole)
  @IsOptional()
  type: string;

  @IsDate()
  @IsOptional()
  startDate: Date;

  @IsDate()
  @IsOptional()
  endDate: Date;
}
