import { IsNotEmpty, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserGeneralDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(10, 50)
  name: string;
}
