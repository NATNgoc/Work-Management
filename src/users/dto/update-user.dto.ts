import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Transform } from 'class-transformer';

export class UpdateUserGeneralDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(10, 50)
  name: string;
}
