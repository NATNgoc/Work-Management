import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { DueDateGreaterThanCurrentDate } from '../validation/due-date.validation';

export class UpdateGeneralTaskInfoDto {
  @IsOptional()
  @IsString()
  @Length(10, 255)
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  @Validate(DueDateGreaterThanCurrentDate)
  dueDate: Date;
}

export default UpdateGeneralTaskInfoDto;
