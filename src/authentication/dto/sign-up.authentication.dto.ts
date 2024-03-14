import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export default SignUpDto;
