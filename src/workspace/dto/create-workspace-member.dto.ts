import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWorkspaceMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsUUID()
  @IsNotEmpty()
  owner_id: string;
}
