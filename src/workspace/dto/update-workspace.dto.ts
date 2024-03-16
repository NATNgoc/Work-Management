import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {
  @IsString()
  @Length(8, 60)
  @IsOptional()
  name: string;

  @IsString()
  @Length(10, 100)
  @IsOptional()
  description: string;
}

export default UpdateWorkspaceDto;
