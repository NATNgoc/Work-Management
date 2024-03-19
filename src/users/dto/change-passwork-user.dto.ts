import { IsNotEmpty, IsString, Length } from 'class-validator';

export class changePasswordDto {
  @IsString()
  @Length(6, 255)
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @Length(6, 255)
  @IsNotEmpty()
  newPassword: string;
}
