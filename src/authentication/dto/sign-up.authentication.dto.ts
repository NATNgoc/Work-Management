import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @ApiProperty({ example: 'nguyenatn2003@gmail.com' })
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Nguyễn Anh Tuấn Ngọc' })
  @MaxLength(50)
  name: string;

  @IsStrongPassword()
  @ApiProperty({ example: 'NguyenNgoc123@' })
  @IsNotEmpty()
  password: string;
}

export default SignUpDto;
