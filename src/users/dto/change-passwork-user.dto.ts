import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class changePasswordDto {
  @IsString()
  @Length(6, 255)
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @Length(6, 255)
  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;
}
