import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  IsEnum,
} from 'class-validator';
import WorkspaceType from 'src/enum/workspace-type.enum';
import { ManyToOne, OneToMany } from 'typeorm';

export class CreateWorkspaceDto {
  @IsString()
  @Length(5, 50)
  @ApiProperty({ example: 'Đồ án thực tập tại công ty QKIT' })
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(10, 100)
  @ApiProperty({
    example:
      'Đồ án làm về cấu hình backend server cho một app quản lý công việc với nhiều thành viên tham dự',
  })
  description: string;

  @IsString()
  @IsEnum(WorkspaceType)
  @IsNotEmpty()
  type: string;
}
