import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import WorkspaceMemberRole from 'src/enum/workspace-member-role.enum';

export class FindAllWorkSpaceDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ownerId: string;

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

export default FindAllWorkSpaceDto;
