// CreateUserDTO.ts
import { Exclude } from 'class-transformer';
import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 255) // Độ dài từ 6 đến 255 ký tự
  password: string;
}
