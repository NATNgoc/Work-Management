import { IsUUID, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ManyToOne, OneToMany } from 'typeorm';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
