import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(50)
  name: string;

  @IsStrongPassword()
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export default SignUpDto;
