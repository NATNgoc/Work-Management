import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'nguyenatn2003@gmail.com' })
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({ example: 'NguyenNgoc123@' })
  password: string;
}

export default LoginDto;
