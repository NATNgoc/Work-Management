import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(10)
  description: string;

  @IsDateString()
  dueDate: Date;
}
