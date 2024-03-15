import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { IsString, Length } from 'class-validator';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {
  @IsString()
  @Length(8, 50)
  name: string;

  @IsString()
  @Length(10, 100)
  description: string;
}

export default UpdateWorkspaceDto;
